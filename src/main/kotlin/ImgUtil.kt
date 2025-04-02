package com.maltsburg

import java.awt.image.BufferedImage

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
}