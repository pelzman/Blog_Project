import { PrismaClient} from "@prisma/client"

export const generateSlug=  async (title:string):Promise<string> =>{
    const prisma = new PrismaClient()
    const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g,  '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

    let slug = baseSlug
    let counter = 1

    while(true){
        const existingSlug =  await prisma.post.findUnique({where:{slug}})
        if(!existingSlug) break

        slug = `${baseSlug}-${counter++}`
    }

    return slug
}