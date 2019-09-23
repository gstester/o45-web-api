import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';

import { of } from 'rxjs';

import * as fs from 'fs';
import * as path from 'path';
import * as JSZip from 'jszip';
import * as docxtemplater from 'docxtemplater';

import { TenantService } from './tenant.service';
import { ISummaryEntry, SummaryEntry } from '../models/summary';
import { CostKeyService } from './cost-key.service';
import { FlatService } from './flat.service';
import { UsageService } from './usage.service';
import { IUsage } from '../models/usage.dto';
import { CostKeyModelService } from './cost-key-model.service';

interface IDifference {
    differences: Array<ISummaryEntry>;
}

@Injectable()
export class SummaryService {
    private readonly _ASSETS = './assets';
    private readonly _SERIENBRIEF = 'SerienbriefTemplateWasser.docx';//'SerienbriefTemplate.docx';
    private readonly _DIFFERENZTEMPLATE = 'DifferenzTemplate.docx';

    constructor(private readonly _tenantService: TenantService, private readonly _costKeyService: CostKeyModelService,
        private readonly _flatService: FlatService, private readonly _usageService: UsageService) { }

    public async getAsync(costKeyId: string): Promise<Array<ISummaryEntry>> {
        const res: Array<ISummaryEntry> = await this._getSummaryAsync(costKeyId);

        return of(res).toPromise();
    }

    private async _getSummaryAsync(costKeyId: string): Promise<Array<ISummaryEntry>> {
        const costKeyOjectID = await this._costKeyService.findObjectIDAsync(costKeyId);

        const usages = await this._usageService.findUsageByObjectIDAsync(costKeyOjectID);
        
        const res: Array<ISummaryEntry> = usages.map(u => this._calulateSummary(u));

        const allUpfront = res.reduce((acc, cur) => acc + cur.SummeGezahlt, 0);
        const total = res.reduce((acc, cur) => acc + cur.SummeGesamt, 0);
        const diff = res.reduce((acc, cur) => acc + cur.Differenz, 0);

        console.log(`Total: ${total}, Upfront: ${allUpfront}, Diff: ${diff}, Test: ${allUpfront - diff}`);

        

        return res;
    }

    private _calulateSummary(usage: IUsage): ISummaryEntry {
        return SummaryEntry.create(usage);
    }

    public async saveAsync(costKeyId: string): Promise<Array<ISummaryEntry>> {
        try {
            const res: Array<ISummaryEntry> = await this._getSummaryAsync(costKeyId);

            this._save(res);

            return of(res).toPromise();
        }
        catch (err) {
            console.error(err);


        }
    }

    private _save(res: ISummaryEntry[]) {
        const outputDir = this._createOutputDirictory(res);

        res.forEach(r => {
            const filename = `${r.Lage.replace(' ', '_')}.docx`;

            this._saveDocx(r, this._SERIENBRIEF, outputDir, filename);
        });

        const difference: IDifference = {
            differences: res
        };

        this._saveDocx(difference, this._DIFFERENZTEMPLATE, outputDir, 'differenz.docx');
        }

    private _createOutputDirictory(res: Array<ISummaryEntry>): string {
        if (res && res.length > 0) {
            const year = res[0].Jahr.toString();

            const dirname = path.resolve(`${this._ASSETS}/${year}`);
            if (!fs.existsSync(dirname))
                fs.mkdirSync(dirname);

            return dirname;
        }

        return this._ASSETS;
    }

    private async _saveCsv(res: ISummaryEntry[]) {
        let converter = require('json-2-csv');
        const csv = await converter.json2csvAsync(res, { delimiter: { field: ';' } });

        console.log(csv);

        fs.writeFileSync('test.csv', csv);
    }

    private _saveDocx(data: ISummaryEntry | IDifference, template: string, outputDir: string, filename: string) {
        try {
            const content = fs.readFileSync(path.resolve('./assets', template), 'binary');

            const zip = new JSZip(content);

            const doc = new docxtemplater();
            doc.loadZip(zip);

            doc.setData(data);

            doc.render();

            const buf = doc.getZip().generate({ type: 'nodebuffer' });


            fs.writeFileSync(path.resolve(outputDir, filename), buf);
        }
        catch (err) {
            console.log(err);
        }
    }
}