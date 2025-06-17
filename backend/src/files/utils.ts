import { Request } from "express";
import { readdir } from "fs/promises";

export const UPLOAD_FILE_PATH=()=>`./${process.env.UPLOAD_FILE_PATH}/`;
export const STORE_FILE_PATH=()=>`./${process.env.STORE_FILE_PATH}/`;

export function getFileNamePrefix(req:Request): string {
    return 'User_'+req.user.id+'_'
}

export async function calcFilesByMask(path:string, mask: string): Promise<number> {
    const files = await readdir(path);
    const pattern = `${mask}.*\\..*`;
    const regex = new RegExp(`^${pattern}$`);
    const length = files.filter(file => regex.test(file)).length;
    return length;
}