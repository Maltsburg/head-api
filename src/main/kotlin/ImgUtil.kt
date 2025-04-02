package com.maltsburg

import com.maltsburg.Util.skin
import java.awt.image.BufferedImage
import java.io.ByteArrayInputStream
import java.io.File
import javax.imageio.ImageIO

object ImgUtil {
    fun scaleImage(image: BufferedImage, scale: Int): BufferedImage {
        val width = image.width * scale
        val height = image.height * scale
        val img = BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB)

        val g = img.createGraphics()
        g.drawImage(image, 0, 0, width, height, null)
        g.dispose()

        return img
    }

    fun cache(username: String): BufferedImage {
        val filename = if (username.startsWith(".")) "!" + username.substring(1) else username
        val cacheDir = File("skins").apply { if (!exists()) mkdirs() }
        val skinFile = File(cacheDir, "${filename}.png") // cache skin image

        // if skin image is cached use that. if not, get and save.
        return if (skinFile.exists()) {
            ImageIO.read(skinFile)
        } else {
            val skinImage = ImageIO.read(ByteArrayInputStream(username.skin.first))
            ImageIO.write(skinImage, "PNG", skinFile) // save
            skinImage
        }
    }
}