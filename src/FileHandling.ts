import { promises } from 'fs'
import { ProcessStack } from './DataType'


export async function loadFile() {
    const filePath = './src/temp/stack.json'
    try {
        let data = await promises.readFile(filePath, 'utf8')
        return JSON.parse(data) as ProcessStack
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            try {
                await promises.mkdir('./src/temp', { recursive: true });
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
    await promises.writeFile('./src/temp/stack.json', json)
}


export async function submitReport(data: string) {
    const options = { timeZone: 'Asia/Kolkata' };
    const date = new Date()
    const text = `${data} \n ----------------- ${date.toLocaleDateString('en-IN', options)} | ${date.toLocaleTimeString('en-IN', options)}----------------- \n\n\n\n`
    await promises.appendFile('./src/temp/report.txt', text)
}
