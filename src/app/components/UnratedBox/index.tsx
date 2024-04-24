'use client'

import { useEffect, useState } from 'react'
import { storage } from '../../../../firebase-config'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Resizer from 'react-image-file-resizer'

function UnratedBox() {
    const [url, setUrl] = useState<string>('')
    const resizeFile = (file: File) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                300,
                300,
                'JPEG',
                100,
                0,
                (uri) => {
                    resolve(uri)
                },
                'file'
            )
        })

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files ? event.target.files[0] : null
        if (!file) return
        const fileName = file.name.split('.')
        const extension = fileName[fileName.length - 1]
        if (extension.includes('jpg' || 'png' || 'jpeg' || 'webp')) {
            console.log(file)
            const newImage = await resizeFile(file)
            const fileRef = ref(storage, `tierlist/${Date.now() + file.name}`)
            await uploadBytes(fileRef, newImage as File)
            const uploadedUrl = await getDownloadURL(fileRef)
            setUrl(uploadedUrl)
        } else {
            console.log(`ceci n'est pas une image`)
        }
    }

    return (
        <div>
            <div>
                {/* {tierlists[0].unratedItems.map((unratedItem) => (
                    <img src={unratedItem.image} key={unratedItem.id}></img>
                ))} */}
            </div>
            <div>
                <input type="file" onChange={handleFileChange} />
                {url && <img src={url} alt="Uploaded" />}
            </div>
        </div>
    )
}

export default UnratedBox
