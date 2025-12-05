import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CloudinaryService{

    constructor(@Inject('CLOUDINARY') private cloudinary){}


    async uploadImage(file:Express.Multer.File):Promise<{secure_url:string, public_id:string}>{
       return new Promise((resolve, reject)=>{
        const upload = this.cloudinary.uploader.upload_stream(
            {folder:"blog-img"},

            (error, result)=>{
                if(error) return reject(error)
                    resolve({
                   secure_url: result.secure_url,
                   public_id:result.public_id
                })
            }
        )
        return upload.end(file.buffer)
       })
    }
}