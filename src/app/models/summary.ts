import * as moment from 'moment';

import { ICostKey, CostKey } from "./cost-key.dto";
import { IFlat } from "./flat.dto";
import { IUsage } from "./usage.dto";
import { IUpfrontPayment } from "./upfront-payment.dto";
import { FlatType } from "./enumeration";


//SELECT [Kostenschlüssel Query Grouped].Namen, [Kostenschlüssel Query Grouped].Mieter_Mieteinheit AS Mieteinheit, [Kostenschlüssel Query Grouped].Mieteinheiten_ID, 
//[Kostenschlüssel Query Grouped].Lage, [Kostenschlüssel Query Grouped].Personenzahl, 
//Format([Kostenschlüssel Query Grouped].Mieteinheiten_Verbrauchskosten,'Currency') AS VerbrKost, 
//Format([Kostenschlüssel Query Grouped].Mieteinheiten_Grundkosten,'Currency') AS GrundKost, 
//Format([Kostenschlüssel Query Grouped].Verbrauch_Jahr,'Currency') AS VerbrJahr, 
//Format([Kostenschlüssel Query Grouped].Verbrauch_Mieteinheit,'Currency') AS VerbrMietEin, 
//Format([Kostenschlüssel Query Grouped].Grundanteile,'#,##0.000') AS GrundAnteile, 
//Format([Kostenschlüssel Query Grouped].Verbrauchsanteile,'#,##0.000') AS VerbrAnteile, 
//Format([Kostenschlüssel Query Grouped].Verbrauch_Grundkosten,'Currency') AS VergrGrundKost, 
//Format([Kostenschlüssel Query Grouped].Verbrauch_Verbrauchskosten,'Currency') AS VerbrVerbrKost, 
//Format([Kostenschlüssel Query Grouped].Grundkosten_gezahlt,'Currency') AS GrundGezahlt, 
//Format([Kostenschlüssel Query Grouped].Verbrauchskosten_gezahlt,'Currency') AS VerbrGezahlt,
//Format([Kostenschlüssel Query Grouped].Differenz,'Currency') AS Differenz, 
//[Kostenschlüssel Query Grouped].Kostenschlüssel_Jahr AS Jahr, 
//Format([Kostenschlüssel Query Grouped].Kostenschlüssel_Grundkosten,'#,##0.000 €') AS SchluessGrundKost, 
//ormat([Kostenschlüssel Query Grouped].Kostenschlüssel_Verbrauchskosten,'#,##0.000 €') AS SchluessVerbrKost, 
//Format([Kostenschlüssel Query Grouped].Grundkosten_gezahlt-[Kostenschlüssel Query Grouped].Verbrauch_Grundkosten,'Currency') AS DiffGrund, 
//Format([Kostenschlüssel Query Grouped].Verbrauchskosten_gezahlt-[Kostenschlüssel Query Grouped].Verbrauch_Verbrauchskosten,'Currency') AS DiffVerbr, 
//IIf([Kostenschlüssel Query Grouped].Differenz>0,'Der Betrag in Höhe von ' & Format(Abs([Kostenschlüssel Query Grouped].Differenz),'Currency') & 
//' wird vom Hauskonto Anfang des Jahres ' & Format(DateAdd('yyyy',0,[Kostenschlüssel Query Grouped].Kostenschlüssel_Jahr),'yyyy') &
// ' auf ein Konto von euch überwiesen oder Bar ausgezahlt.','Bitte überweist den Betrag von ' & 
//Format(Abs([Kostenschlüssel Query Grouped].Differenz),'Currency') & ' Anfang des Jahres ' & 
//Format(DateAdd('yyyy',0,[Kostenschlüssel Query Grouped].Kostenschlüssel_Jahr),'yyyy') & ' auf das Hauskonto.') AS SchlussSatz INTO Serienbrief2011_2012
//FROM [Kostenschlüssel Query Grouped];

export interface ISummaryEntry {
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
}

export class SummaryEntry implements ISummaryEntry {
    constructor() {
        moment.locale('de');
        this.Date = moment().format('DD. MMMM YYYY');
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

    Negativ: boolean;
    RawXml: string;

    SchlussSatz: string;

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



    static create(usage: IUsage): SummaryEntry {
        const upfrontPayment = CostKey.getUpfrontPayment(usage.costKey, usage.flat.type);
        const upfrontPaymentSummaries = SummaryEntry.calculatePaymentSummaries(upfrontPayment, usage);

        const result = new SummaryEntry();

        result.Jahr = usage.costKey.year;

        result.GrundkostenSchluessel = usage.costKey.heatingBasisCostKey;
        result.VerbrauchskostenSchluessel = usage.costKey.heatingUsageCostKey;

        result.Mieteinheiten_ID = usage.flat.id;
        result.Mieteinheit = usage.flat.id;
        result.Lage = usage.flat.name;

        result.Personenzahl = usage.flat.tenantCount;
        result.Namen = usage.flat.tenants.map(t => t.name).join(', ');

        result.GrundkostenVorschuss = upfrontPayment.basis;
        result.VerbrauchskostenVorschuss = upfrontPayment.usage;

        result.GrundAnteile = usage.flat.basisParts;
        result.VerbrauchsAnteile = usage.heating;

        result.GrundkostenGezahlt = upfrontPaymentSummaries.basicUpfrontSummary;
        result.VerbrauchskostenGezahlt = upfrontPaymentSummaries.usageUpfrontSummary;
        result.SummeGezahlt = upfrontPaymentSummaries.basicUpfrontSummary + upfrontPaymentSummaries.usageUpfrontSummary;

        const grundkosten = result.GrundkostenSchluessel * usage.flat.basisParts;
        const verbrauchskosten = result.VerbrauchskostenSchluessel * usage.heating;

        //result.SummeKosten = grundkosten + verbrauchskosten;

        result.HeizungGrundkosten = Math.round((grundkosten) * 100 + Number.EPSILON) / 100;
        result.HeizungVerbrauchskosten = Math.round((verbrauchskosten) * 100 + Number.EPSILON) / 100;
        result.SummeHeizung = Math.round((result.HeizungGrundkosten + result.HeizungVerbrauchskosten) *100 + Number.EPSILON) / 100;

        if (usage.flat.type === FlatType.Living)
            result.WasserGrundkosten = Math.round((usage.costKey.waterBasisCostKey * usage.flat.basisParts) * 100 + Number.EPSILON) / 100;
        else
            result.WasserGrundkosten = 0;

        result.WasserVerbrauchskosten = Math.round((usage.costKey.waterUsageCostKey * usage.water) * 100 + Number.EPSILON) / 100;
        result.SummeWasser = result.WasserGrundkosten + result.WasserVerbrauchskosten;

        result.SummeGesamt = result.SummeHeizung + result.SummeWasser;

        const grundKostenGesamt = result.HeizungGrundkosten + result.WasserGrundkosten;
        const verbrauchKostenGesamt = result.HeizungVerbrauchskosten + result.WasserVerbrauchskosten;

        result.SummeGrundkosten = Math.round(grundKostenGesamt * 100 + Number.EPSILON) / 100;
        result.SummeVerbrauchskosten = Math.round(verbrauchKostenGesamt * 100 + Number.EPSILON) / 100;

        result.DifferenzGrundkosten = Math.round((result.GrundkostenGezahlt - grundKostenGesamt) * 100 + Number.EPSILON) / 100;
        result.DifferenzVerbrauchskosten = Math.round((result.VerbrauchskostenGezahlt - verbrauchKostenGesamt) * 100 + Number.EPSILON) / 100;
        result.Differenz = Math.round((result.DifferenzGrundkosten + result.DifferenzVerbrauchskosten) * 100 + Number.EPSILON) / 100;


        result.pHeizungGrundkosten = result.HeizungGrundkosten.toFixed(2);
        result.pHeizungVerbrauchskosten = result.HeizungGrundkosten.toFixed(2);
        result.pSummeHeizung = result.HeizungGrundkosten.toFixed(2);

        result.pWasserGrundkosten = result.WasserGrundkosten.toFixed(2);
        result.pWasserVerbrauchskosten = result.WasserVerbrauchskosten.toFixed(2);
        result.pSummeWasser = result.SummeWasser.toFixed(2);

        result.pSummeGrundkosten = result.SummeGrundkosten.toFixed(2);
        result.pSummeVerbrauchskosten = result.SummeVerbrauchskosten.toFixed(2);
        result.pSummeGesamt = result.SummeGesamt.toFixed(2);

        result.pDifferenzGrundkosten = result.DifferenzGrundkosten.toFixed(2);
        result.pDifferenzVerbrauchskosten = result.DifferenzVerbrauchskosten.toFixed(2);
        result.pDifferenz = result.Differenz.toFixed(2);

        result.Negativ = result.Differenz < 0;

        const color = result.Negativ ? 'FF0000' : '000000';

        result.RawXml = `<w:p><w:pPr><w:rPr><w:color w:val="${color}" /><w:jc w:val="center"/></w:rPr></w:pPr><w:r><w:rPr>
        <w:color w:val="${color}"/><w:b/><w:jc w:val="center"/></w:rPr><w:t>${Math.abs(result.Differenz).toFixed(2)} €</w:t></w:r></w:p>`;

        result.SchlussSatz = SummaryEntry.getSchlussSatz(result.Differenz, result.Jahr);



        return result;
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

                    months += result;
                }
                else {
                    const result = SummaryEntry.calculateMonthsWithOutMovedOut(start, end, moveIn);

                    months += result;
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

        return 12 -result;
    }

    static getSchlussSatz(differenz: number, jahr: number): string {
        if (differenz > 0) {
            return `Der Betrag in Höhe von ${Math.abs(differenz).toFixed(2)} € wird vom Hauskonto Anfang des Jahres ${jahr + 1} auf ein Konto von euch überwiesen oder Bar ausgezahlt.`;
        }
        else {
            return `Bitte überweist den Betrag von ${Math.abs(differenz).toFixed(2)} €  Anfang des Jahres ${jahr + 1}  auf das Hauskonto.`;
        }
    }
}