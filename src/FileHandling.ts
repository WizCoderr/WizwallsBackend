import { promises } from 'fs'
import { ProcessStack } from './DataType'
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempDir = path.join(__dirname, 'temp');
const filePath = path.join(tempDir, 'stack.json');
const reportPath = path.join(tempDir, 'report.txt');


export async function loadFile() {
    try {
        let data = await promises.readFile(filePath, 'utf8')
        return JSON.parse(data) as ProcessStack
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            try {
                await promises.mkdir(tempDir, { recursive: true });
            } catch (dirError) {
                console.error("Error creating directory:", dirError);
                throw dirError;
            }

            const defaultStack: ProcessStack = {
                apiCount: 0,
                photoIndex: 0,
                categoriesName: [],
                collections: []
            };
            await saveFile(defaultStack)
            return defaultStack
        } else {
            throw error
        }
    }
}

export async function saveFile(data: ProcessStack) {
    const json = JSON.stringify(data, null, 4)
    await promises.writeFile(filePath, json)
}


export async function submitReport(data: string) {
    const options = { timeZone: 'Asia/Kolkata' };
    const date = new Date()
    const text = `${data} \n ----------------- ${date.toLocaleDateString('en-IN', options)} | ${date.toLocaleTimeString('en-IN', options)}----------------- \n\n\n\n`
    await promises.appendFile(reportPath, text)
}
