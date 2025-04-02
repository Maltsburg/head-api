package com.maltsburg.routes

import com.maltsburg.Util.skin
import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.skin() {
    get("/skin/{username?}") {
        val username = call.parameters["username"]

        if (username.isNullOrBlank()) {
            return@get call.respondText { "Please enter a username." }
        }

        call.respondBytes(username.skin.first, ContentType.Image.PNG)
    }
}