package com.maltsburg

import com.maltsburg.pages.home
import com.maltsburg.routes.*
import io.ktor.server.application.*
import io.ktor.server.html.*
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
        get("/") { call.respondHtml { home() } }
        skin()
        body()
        torso()
        head()
    }
}