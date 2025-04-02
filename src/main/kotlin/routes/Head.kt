package com.maltsburg.routes

import com.maltsburg.ImgUtil.scaleImage
import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.awt.Graphics2D
import java.awt.image.BufferedImage
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import javax.imageio.ImageIO

fun Route.head() {
    get("/head/{username?}/{scale?}") {
        val username = call.parameters["username"]
        val scale = call.parameters["scale"]?.toInt() ?: 4

        if (username.isNullOrBlank()) {
            return@get call.respondText { "Please enter a username." }
        }
        call.respondBytes(headBuilder(username, scale), ContentType.Image.PNG)
    }
}

fun headBuilder(username: String, scale: Int = 1): ByteArray {
    try {
        val img = ImageIO.read(ByteArrayInputStream(torsoBuilder(username)))

        // create canvas
        val canvas = BufferedImage(8, 8, BufferedImage.TYPE_INT_ARGB)
        val g: Graphics2D = canvas.createGraphics()

        g.drawImage(img, 0, 0, 8, 8, 4, 0, 12, 8, null)
        g.dispose()

        val byteArrayOutputStream = ByteArrayOutputStream()
        ImageIO.write(scaleImage(canvas, scale), "PNG", byteArrayOutputStream)

        return byteArrayOutputStream.toByteArray()
    } catch (e: Exception) {
        println("Error in headBuilder: ${e.message}")
        throw RuntimeException(e.message)
    }
}