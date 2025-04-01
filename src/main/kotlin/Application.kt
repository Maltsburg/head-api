package com.maltsburg

import io.ktor.server.application.*
import kotlinx.coroutines.launch

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    // test
    launch {
        println(Util.java("maltsburg"))
        println(Util.bedrock("maltsburg"))
    }
    configureRouting()
}