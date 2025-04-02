package com.maltsburg

import com.maltsburg.routes.body
import com.maltsburg.routes.head
import com.maltsburg.routes.skin
import com.maltsburg.routes.torso
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.coroutines.launch
import java.io.File

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureRouting()
}

fun Application.configureRouting() {
    // delete cache folder on launch
    launch { File("skins").deleteRecursively() }
    routing {
        get("/") {
            call.respondText("API Version: ${System.getProperty("project.version")}")
        }
        skin()
        body()
        torso()
        head()
    }
}