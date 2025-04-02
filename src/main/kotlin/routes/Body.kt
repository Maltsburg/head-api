package com.maltsburg.routes

import com.maltsburg.ImgUtil.cache
import com.maltsburg.ImgUtil.scaleImage
import com.maltsburg.Util.skin
import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.awt.Graphics2D
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import javax.imageio.ImageIO

fun Route.body() {
    get("/body/{username?}/{scale?}") {
        val username = call.parameters["username"]
        val scale = call.parameters["scale"]?.toInt() ?: 4

        if (username.isNullOrBlank()) {
            return@get call.respondText { "Please enter a username." }
        }
        call.respondBytes(bodyBuilder(username, scale), ContentType.Image.PNG)
    }
}

fun bodyBuilder(username: String, scale: Int = 1): ByteArray {
    try {
        val img = cache(username) // cache process

        // deal with the boomer layout
        if (img.height == 32) return oldSkin(img, scale)

        val canvas = BufferedImage(16, 32, BufferedImage.TYPE_INT_ARGB)
        val g: Graphics2D = canvas.createGraphics()

        val isSlim = username.skin.second == "slim"
        val lArm = if (isSlim) 1 else 0
        val rArm = if (isSlim) 15 else 16

        // Head
        g.drawImage(img, 4, 0, 12, 8, 8, 8, 16, 16, null)
        // Head layer
        g.drawImage(img, 4, 0, 12, 8, 40, 8, 48, 16, null)
        // Body
        g.drawImage(img, 4, 8, 12, 20, 20, 20, 28, 32, null)
        // Body layer
        g.drawImage(img, 4, 8, 12, 12, 20, 36, 28, 48, null)
        // Left Leg
        g.drawImage(img, 4, 20, 8, 32, 4, 20, 8, 32, null)
        // Left Leg layer
        g.drawImage(img, 4, 20, 8, 32, 4, 36, 8, 48, null)
        // Right Leg
        g.drawImage(img, 8, 20, 12, 32, 20, 52, 24, 64, null)
        // Right Leg layer
        g.drawImage(img, 8, 20, 12, 32, 4, 52, 8, 64, null)
        // Left Arm
        g.drawImage(img, lArm, 8, 4, 20, 44, 20, 48, 32, null)
        // Left Arm layer
        g.drawImage(img, lArm, 8, 4, 20, 44, 36, 48, 48, null)
        // Right Arm
        g.drawImage(img, 12, 8, rArm, 20, 36, 52, 40, 64, null)
        // Right Arm layer
        g.drawImage(img, 12, 8, rArm, 20, 52, 52, 56, 64, null)

        g.dispose()

        val array = ByteArrayOutputStream()
        ImageIO.write(scaleImage(canvas, scale), "PNG", array)

        return array.toByteArray()
    } catch (e: Exception) {
        println("Error in bodyBuilder: ${e.message}")
        throw RuntimeException(e.message)
    }
}

fun oldSkin(img: BufferedImage, scale: Int): ByteArray {
    try {
        val canvas = BufferedImage(16, 32, BufferedImage.TYPE_INT_ARGB)
        val g: Graphics2D = canvas.createGraphics()

        // Head
        g.drawImage(img, 4, 0, 12, 8, 8, 8, 16, 16, null)
        // Body
        g.drawImage(img, 4, 8, 12, 20, 20, 20, 28, 32, null)
        // Left Leg
        g.drawImage(img, 4, 20, 8, 32, 4, 20, 8, 32, null)
        // Right Leg
        g.drawImage(img, 8, 20, 12, 32, 4, 20, 8, 32, null)
        // Left Arm
        g.drawImage(img, 0, 8, 4, 20, 44, 20, 48, 32, null)
        // Right Arm (left arm flipped)
        g.drawImage(img, 16, 8, 12, 20, 44, 20, 48, 32, null)

        g.dispose()

        val array = ByteArrayOutputStream()
        ImageIO.write(scaleImage(canvas, scale), "PNG", array)

        return array.toByteArray()
    } catch (e: Exception) {
        println("Error in bodyBuilder: ${e.message}")
        throw RuntimeException(e.message)
    }
}