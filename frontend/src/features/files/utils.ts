export function calcUpdateImage(image_URL: string | null, 
    new_image_URL: string | null | undefined): string | null | undefined {
    let newImageURL = image_URL;
    if (new_image_URL !== undefined)
        newImageURL = new_image_URL
    return newImageURL
}
