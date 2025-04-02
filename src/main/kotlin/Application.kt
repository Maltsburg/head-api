package com.maltsburg

import com.maltsburg.routes.skin
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureRouting()
}

fun Application.configureRouting() {
    val projectVersion = System.getProperty("project.version")
    routing {
        get("/") { call.respondText("API Version: $projectVersion") }
        skin()
    }
}