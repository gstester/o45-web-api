import * as moment from 'moment';

import { ICostKey, CostKey } from "./cost-key.dto";
import { IFlat } from "./flat.dto";
import { IUsage } from "./usage.dto";
import { IUpfrontPayment } from "./upfront-payment.dto";
import { FlatType } from "./enumeration";
import { ITenant } from './tenant.dto';
import { Config } from '../../app.config';

const _calculateTenantNamesAndCount = (usage: IUsage, summary: ISummaryEntry) => {
    const tenants = usage.flat.tenants.filter(t => _filterTenant(t, moment(usage.costKey.from), moment(usage.costKey.to)));

    summary.Namen = tenants.map(t => t.name).join(', ');
    summary.Personenzahl = tenants.length;
}

const _filterTenant = (tenant: ITenant, from: moment.Moment, to: moment.Moment): boolean => {
    const moveIn = moment(tenant.moveIn);
    const moveOut = tenant.moveOut ? moment(tenant.moveOut) : moment('2100-01-01');

    if (from.isSameOrAfter(moveOut))
        return true;

    if (to.isSameOrBefore(moveIn))
        return false;

    return true;;
}

export class WaterStatistic {
    constructor(usage: IUsage, readonly price: number, readonly totalWaterPrice: number, readonly totalAvarage: number,
        readonly totalMedian: number, readonly avarageDifference: number,
        readonly medianDiffernce: number) {
        this.personCount = WaterStatistic.calculatePersonCountPerYear(usage);
    }

    readonly personCount: number;

    static calculateStatistics(usages: Array<IUsage>, summaries: Array<ISummaryEntry>) {
        const persons = usages.map(u => WaterStatistic.calculatePersonCountPerYear(u)).reduce((acc, cur) => {

            return acc += cur;
        }, 0);

        const totalWaterPrice = WaterStatistic.calculateTotalWaterPrice(summaries);
        const totalAvaragePrice = WaterStatistic.calculateAvaragePrice(persons, totalWaterPrice);
        const totalMedianPrice = WaterStatistic.calculateMedianPrice(summaries);
        const avarageDifference = WaterStatistic.calculateAvarageDifference(persons, summaries);
        const medianDiffernce = WaterStatistic.calculateMedianDifference(summaries);

        return {
            totalWaterPrice: totalWaterPrice,
            totalAvaragePrice: totalAvaragePrice,
            totalMedianPrice: totalMedianPrice,
            avarageDifference: avarageDifference,
            medianDiffernce: medianDiffernce
        };
    }

    static calculateTotalWaterPrice(summaries: Array<ISummaryEntry>): number {
        const price = summaries.reduce((acc, cur) => {
            acc += cur.SummeWasser;
            return acc;
        }, 0);

        return price;
    }

    static calculateAvarageDifference(persons: number, summaries: Array<ISummaryEntry>): number {
        const differences = summaries.reduce((acc, cur) => {

            return acc += cur.Differenz;
        }, 0);

        return Math.round((differences / persons) * 100 + Number.EPSILON) / 100;
    }

    static calculateMedianDifference(summaries: Array<ISummaryEntry>): number {
        const diffs = summaries.map(s => s.Differenz).sort();

        if (diffs.length === 0)
            return 0;

        if (diffs.length % 2 === 0) {
            return (diffs[(length / 2) - 1] + diffs[length / 2]) / 2;
        }

        return diffs[Math.floor(diffs.length / 2)];
    }

    static calculateAvaragePrice(persons: number, totalWaterPrice: number): number {
        return Math.round((totalWaterPrice / persons) * 100 + Number.EPSILON) / 100;
    }

    static calculateMedianPrice(summaries: Array<ISummaryEntry>): number {
        const sums = summaries.map(s => s.SummeWasser).sort();

        if (sums.length === 0)
            return 0;

        if (sums.length % 2 === 0) {
            return (sums[(length / 2) - 1] + sums[length / 2]) / 2;
        }

        return sums[Math.floor(sums.length / 2)];
    }

    static calculatePersonCountPerYear(usage: IUsage): number {
        const tenants = usage.flat.tenants.filter(t => _filterTenant(t, moment(usage.costKey.from), moment(usage.costKey.to)));

        const from = moment(usage.costKey.from);
        const to = moment(usage.costKey.to);

        const months = tenants.reduce((acc, cur) => {
            const moveIn = moment(cur.moveIn);
            const moveOut = cur.moveOut ? moment(cur.moveOut) : moment('2100-01-01');

            if (moveIn.isSameOrBefore(from) && moveOut.isSameOrAfter(to))
                acc += 12;

            if (moveIn.isSameOrAfter(from) && moveOut.isSameOrAfter(to)) {
                const duration = moment.duration(moveIn.diff(from));
                acc += 12 - Math.round(duration.asMonths());
            }

            if (moveIn.isSameOrBefore(from) && moveOut.isBefore(to)) {
                const duration = moment.duration(to.diff(moveOut));
                acc += 12 - Math.round(duration.asMonths());
            }

            if (moveIn.isAfter(from) && moveOut.isBefore(to)) {
                const duration = moment.duration(moveOut.diff(moveIn));
                acc += 12 - Math.round(duration.asMonths());
            }

            return acc;
        }, 0);

        const result = Math.ceil(months / 12);

        return result;
    }
}

export interface ISummaryEntry {
    usage: IUsage;

    Date: string;

    Jahr: number;
    GrundkostenSchluessel: number;
    VerbrauchskostenSchluessel: number;

    Mieteinheit: string;
    Mieteinheiten_ID: string;
    Lage: string;

    Personenzahl: number;
    Namen: string;

    GrundAnteile: number;

    VerbrauchsAnteile: number; // lt. Abrechnung

    GrundkostenVorschuss: number; // monatl. gezahlte Grundkosten in Miete pro Person
    VerbrauchskostenVorschuss: number; // monatl. Verbrauchskosten in Miete pro Person
    SummeGezahlt: number;

    // calculated
    HeizungGrundkosten: number;
    HeizungVerbrauchskosten: number;
    SummeHeizung: number;

    WasserGrundkosten: number;
    WasserVerbrauchskosten: number;
    SummeWasser: number;

    SummeGesamt: number;

    SummeGrundkosten: number;
    SummeVerbrauchskosten: number;

    GrundkostenGezahlt: number;
    VerbrauchskostenGezahlt: number;

    DifferenzGrundkosten: number;
    DifferenzVerbrauchskosten: number;
    Differenz: number;

    Negativ: boolean;
    RawXml: string;

    SchlussSatz: string;

    waterStatistics: WaterStatistic;
}

export class SummaryEntry implements ISummaryEntry {
    constructor(public usage: IUsage) {
        moment.locale('de');
        this.Date = moment().format('DD. MMMM YYYY');

        this.Jahr = usage.costKey.year;

        this.GrundkostenSchluessel = usage.costKey.heatingBasisCostKey;
        this.VerbrauchskostenSchluessel = usage.costKey.heatingUsageCostKey;

        this.Mieteinheiten_ID = usage.flat.id;
        this.Mieteinheit = usage.flat.id;
        this.Lage = usage.flat.name;

        const namesAndCount = _calculateTenantNamesAndCount(usage, this);

        this.GrundAnteile = usage.flat.basisParts;
        this.VerbrauchsAnteile = usage.heating;
    }

    Date: string;

    Jahr: number;
    GrundkostenSchluessel: number;
    VerbrauchskostenSchluessel: number;

    Mieteinheit: string;
    Mieteinheiten_ID: string;
    Lage: string;

    Personenzahl: number;
    Namen: string;

    GrundkostenVorschuss: number; // monatl. gezahlte Grundkosten in Miete pro Person
    VerbrauchskostenVorschuss: number; // monatl. Verbrauchskosten in Miete pro Person

    SummeGezahlt: number;

    GrundAnteile: number;

    VerbrauchsAnteile: number; // lt. Abrechnung

    // calculated
    GrundkostenGezahlt: number;
    VerbrauchskostenGezahlt: number;

    HeizungGrundkosten: number;
    HeizungVerbrauchskosten: number;
    SummeHeizung: number;

    WasserGrundkosten: number;
    WasserVerbrauchskosten: number;
    SummeWasser: number;

    SummeGrundkosten: number;
    SummeVerbrauchskosten: number;
    SummeGesamt: number;

    DifferenzGrundkosten: number;
    DifferenzVerbrauchskosten: number;
    Differenz: number;

    pHeizungGrundkosten: string;
    pHeizungVerbrauchskosten: string;
    pSummeHeizung: string;

    pWasserGrundkosten: string;
    pWasserVerbrauchskosten: string;
    pSummeWasser: string;

    pSummeGrundkosten: string;
    pSummeVerbrauchskosten: string;
    pSummeGesamt: string;

    pDifferenzGrundkosten: string;
    pDifferenzVerbrauchskosten: string;
    pDifferenz: string;

    Negativ: boolean;
    RawXml: string;

    SchlussSatz: string;

    waterStatistics: WaterStatistic;

    static create(usage: IUsage): SummaryEntry {
        const result = new SummaryEntry(usage);

        SummaryEntry._calculateUpfrontPayments(usage, result);

        SummaryEntry._calculateHeating(result, usage);

        SummaryEntry._calculateWater(usage, result);

        SummaryEntry._calculateSums(result);

        SummaryEntry._calculateDifferences(result);

        SummaryEntry._transformPrintables(result);

        SummaryEntry._calculateText(result);

        return result;
    }

    private static _calculateDifferences(result: SummaryEntry) {
        result.DifferenzGrundkosten = Math.round((result.GrundkostenGezahlt - result.SummeGrundkosten) * 100 + Number.EPSILON) / 100;
        result.DifferenzVerbrauchskosten = Math.round((result.VerbrauchskostenGezahlt - result.SummeVerbrauchskosten) * 100 + Number.EPSILON) / 100;
        result.Differenz = Math.round((result.DifferenzGrundkosten + result.DifferenzVerbrauchskosten) * 100 + Number.EPSILON) / 100;
    }

    private static _calculateSums(result: SummaryEntry) {
        if (Config.INCLUDE_WATER) {
            result.SummeGrundkosten = Math.round((result.HeizungGrundkosten + result.WasserGrundkosten) * 100 + Number.EPSILON) / 100;
            result.SummeVerbrauchskosten = Math.round((result.HeizungVerbrauchskosten + result.WasserVerbrauchskosten) * 100 + Number.EPSILON) / 100;
            result.SummeGesamt = result.SummeHeizung + result.SummeWasser;
        }
        else {
            result.SummeGrundkosten = Math.round(result.HeizungGrundkosten * 100 + Number.EPSILON) / 100;
            result.SummeVerbrauchskosten = Math.round(result.HeizungVerbrauchskosten * 100 + Number.EPSILON) / 100;
            result.SummeGesamt = result.SummeHeizung;
        }
    }

    private static _calculateUpfrontPayments(usage: IUsage, result: SummaryEntry) {
        const upfrontPayment = CostKey.getUpfrontPayment(usage.costKey, usage.flat.type);
        const upfrontPaymentSummaries = SummaryEntry.calculatePaymentSummaries(upfrontPayment, usage);

        result.GrundkostenVorschuss = upfrontPayment.basis;
        result.VerbrauchskostenVorschuss = upfrontPayment.usage;
        result.GrundkostenGezahlt = upfrontPaymentSummaries.basicUpfrontSummary;
        result.VerbrauchskostenGezahlt = upfrontPaymentSummaries.usageUpfrontSummary;
        result.SummeGezahlt = upfrontPaymentSummaries.basicUpfrontSummary + upfrontPaymentSummaries.usageUpfrontSummary;
    }

    private static _calculateHeating(result: SummaryEntry, usage: IUsage) {
        result.HeizungGrundkosten = Math.round((result.GrundkostenSchluessel * usage.flat.basisParts) * 100 + Number.EPSILON) / 100;
        result.HeizungVerbrauchskosten = Math.round((result.VerbrauchskostenSchluessel * usage.heating) * 100 + Number.EPSILON) / 100;
        result.SummeHeizung = Math.round((result.HeizungGrundkosten + result.HeizungVerbrauchskosten) * 100 + Number.EPSILON) / 100;
    }

    private static _calculateWater(usage: IUsage, result: SummaryEntry) {
        if (usage.flat.type === FlatType.Living)
            result.WasserGrundkosten = Math.round((usage.costKey.waterBasisCostKey * usage.flat.basisParts) * 100 + Number.EPSILON) / 100;
        else
            result.WasserGrundkosten = 0;

        result.WasserVerbrauchskosten = Math.round((usage.costKey.waterUsageCostKey * usage.water) * 100 + Number.EPSILON) / 100;
        result.SummeWasser = result.WasserGrundkosten + result.WasserVerbrauchskosten;
    }

    static calculatePaymentSummaries(upfrontPayment: IUpfrontPayment, usage: IUsage) {
        const start = moment(usage.costKey.from);
        const end = moment(usage.costKey.to);

        let months = 0;

        if (usage.flat.type === FlatType.Living) {
            usage.flat.tenants.forEach(t => {
                const moveIn = moment(t.moveIn);

                if (t.moveOut) {
                    const moveOut = moment(t.moveOut);

                    const result = SummaryEntry.calculateMonthsWithMovedOut(start, end, moveIn, moveOut);


                    months += t.isChild ? result / 2 : result;
                }
                else {
                    const result = SummaryEntry.calculateMonthsWithOutMovedOut(start, end, moveIn);

                    months += t.isChild ? result / 2 : result;
                }
            });

            const usageUpfrontSummary = upfrontPayment.usage * months;
            const basicUpfrontSummary = upfrontPayment.basis * months;

            return { basicUpfrontSummary: basicUpfrontSummary, usageUpfrontSummary: usageUpfrontSummary };
        }

        const usageUpfrontSummary = upfrontPayment.usage * 12;
        const basicUpfrontSummary = upfrontPayment.basis * 12;

        return { basicUpfrontSummary: basicUpfrontSummary, usageUpfrontSummary: usageUpfrontSummary };
    }

    static calculateMonthsWithMovedOut(start: moment.Moment, end: moment.Moment, moveIn: moment.Moment, moveOut: moment.Moment): number {
        if (start.isSameOrAfter(moveOut))
            return 0;

        if (moveIn.isSameOrBefore(start)) {
            if (end.isSameOrBefore(moveOut))
                return 12;
            else {
                const duration = moment.duration(end.diff(moveOut));
                const result = Math.ceil(duration.asMonths());

                return 12 - result;
            }
        }
        else if (moveIn.isSameOrAfter(end))
            return 0;
        else {
            if (end.isSameOrBefore(moveOut)) {
                const duration = moment.duration(moveIn.diff(start));
                const result = Math.floor(duration.asMonths());

                return 12 - result;
            }
            else {
                const duration = moment.duration(moveOut.diff(moveIn));
                const result = Math.ceil(duration.asMonths());

                return result;
            }
        }

        return 0;
    }

    static calculateMonthsWithOutMovedOut(start: moment.Moment, end: moment.Moment, moveIn: moment.Moment): number {
        if (end.isSameOrBefore(moveIn))
            return 0;

        if (moveIn.isSameOrBefore(start))
            return 12;

        const duration = moment.duration(end.diff(moveIn));
        const result = Math.ceil(duration.asMonths());

        return result;
    }

    private static _transformPrintables(result: SummaryEntry) {
        result.pHeizungGrundkosten = result.HeizungGrundkosten.toFixed(2);
        result.pHeizungVerbrauchskosten = result.HeizungVerbrauchskosten.toFixed(2);
        result.pSummeHeizung = result.SummeHeizung.toFixed(2);

        result.pWasserGrundkosten = result.WasserGrundkosten.toFixed(2);
        result.pWasserVerbrauchskosten = result.WasserVerbrauchskosten.toFixed(2);
        result.pSummeWasser = result.SummeWasser.toFixed(2);

        result.pSummeGrundkosten = result.SummeGrundkosten.toFixed(2);
        result.pSummeVerbrauchskosten = result.SummeVerbrauchskosten.toFixed(2);
        result.pSummeGesamt = result.SummeGesamt.toFixed(2);

        result.pDifferenzGrundkosten = result.DifferenzGrundkosten.toFixed(2);
        result.pDifferenzVerbrauchskosten = result.DifferenzVerbrauchskosten.toFixed(2);
        result.pDifferenz = result.Differenz.toFixed(2);
    }

    private static _calculateText(result: SummaryEntry) {
        result.Negativ = result.Differenz < 0;

        const color = result.Negativ ? 'FF0000' : '000000';

        result.RawXml = `<w:p><w:pPr><w:rPr><w:color w:val="${color}" /><w:jc w:val="center"/></w:rPr></w:pPr><w:r><w:rPr>
        <w:color w:val="${color}"/><w:b/><w:jc w:val="center"/></w:rPr><w:t>${Math.abs(result.Differenz).toFixed(2)} €</w:t></w:r></w:p>`;

        result.SchlussSatz = SummaryEntry.getSchlussSatz(result.Differenz, result.Jahr);
    }

    static getSchlussSatz(differenz: number, jahr: number): string {
        if (differenz > 0) {
            return `Der Betrag in Höhe von ${Math.abs(differenz).toFixed(2)} € wird vom Hauskonto Anfang des Jahres ${jahr + 1} auf ein Konto von euch überwiesen oder Bar ausgezahlt.`;
        }
        else {
            return `Bitte überweist den Betrag von ${Math.abs(differenz).toFixed(2)} €  Anfang des Jahres ${jahr + 1}  auf das Hauskonto.`;
        }
    }

    static test() {
        const start = moment('2017-05-01');
        const end = moment('2018-04-30');

        const moveInBefore = moment('2000-01-01');
        const moveInAfter = moment('2018-05-01');
        const moveInBetween = moment('2017-06-01');

        const moveOutBefore = moment('2017-04-01');
        const moveOutAfter = moment('2018-05-01');
        const moveOutBetween = moment('2017-07-01');

        console.log(`${SummaryEntry.calculateMonthsWithMovedOut(start, end, moveInAfter, moveOutAfter)} must be 0`);
        console.log(`${SummaryEntry.calculateMonthsWithMovedOut(start, end, moveInBefore, moveOutAfter)} must be 12`);
        console.log(`${SummaryEntry.calculateMonthsWithMovedOut(start, end, moveInBefore, moveOutBefore)} must be 0`);
        console.log(`${SummaryEntry.calculateMonthsWithMovedOut(start, end, moveInBefore, moveOutBetween)} must be 2`);
        console.log(`${SummaryEntry.calculateMonthsWithMovedOut(start, end, moveInBetween, moveOutBetween)} must be 1`);

        console.log(`${SummaryEntry.calculateMonthsWithOutMovedOut(start, end, moveInAfter)} must be 0`);
        console.log(`${SummaryEntry.calculateMonthsWithOutMovedOut(start, end, moveInBefore)} must be 12`);
        console.log(`${SummaryEntry.calculateMonthsWithOutMovedOut(start, end, moveInBetween)} must be 1`);
    }
}