import {  IFile}  from '../filesType'
import { Api } from '../../../shared/api/api'; 
import { getCookie } from '../../../shared/utils/cookie'; 

export const API_URL = process.env.REACT_APP_API_URL!;

export interface IFilesAPI {
    uploadFile: (data: FormData) =>any;
}

export class FilesAPI extends Api implements IFilesAPI {


	uploadFile = (data: FormData) => {
		return this.requestWithRefresh<IFile>('/files/upload-image', {
			method: 'POST',
			body: data,
			headers: {
				Authorization: `Bearer ${getCookie('accessToken')}`
			}
		}).then((data) => ({
			...data,
			fileName: data.file_name,
		}));
	};


}



const filesAPI=new FilesAPI(API_URL);
export default filesAPI;
