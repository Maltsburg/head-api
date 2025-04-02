package com.maltsburg

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.*
import java.util.*

object Util {
    private val client = HttpClient { install(ContentNegotiation) { json() } }
    private val JsonElement.clean: String get() = this.jsonPrimitive.content
    fun JsonElement.get(key: String): String? = this.jsonArray[0].jsonObject[key]?.clean

    private const val DEFAULTID = "60a5bd016b3c9a1b9272e4929e30827a67be4ebb219017adbbc4a4d22ebd5b1"
    private const val DEFAULTSKIN = "http://textures.minecraft.net/texture/$DEFAULTID"

    val String.skin: Pair<ByteArray, String>
        get() = if (this.startsWith(".")) bedrock(this.substring(1)) else java(this)

    private fun java(name: String): Pair<ByteArray, String> {
        return runBlocking {
            // get player info
            val pInfoResponse: HttpResponse =
                client.get("https://api.mojang.com/users/profiles/minecraft/$name")

            if (pInfoResponse.status != HttpStatusCode.OK) return@runBlocking Pair(client.get(DEFAULTSKIN).readRawBytes(), "classic")

            val pInfo: JsonObject = pInfoResponse.body()

            // get player profile
            val profileResponse: HttpResponse =
                client.get("https://sessionserver.mojang.com/session/minecraft/profile/${pInfo["id"]?.clean}")

            if (profileResponse.status != HttpStatusCode.OK) return@runBlocking Pair(client.get(DEFAULTSKIN).readRawBytes(), "classic")

            val profile: JsonObject = profileResponse.body()
            // get the encoded textures
            val textures = profile["properties"]?.get("value")
            val skinInfo = Base64.getDecoder().decode(textures).decodeToString()
            val decodedJson: JsonObject = Json.parseToJsonElement(skinInfo).jsonObject

            val skinData = decodedJson["textures"]?.jsonObject
                ?.get("SKIN")?.jsonObject

            val url = skinData
                ?.get("url")?.clean ?: DEFAULTSKIN

            val model = skinData
                ?.get("metadata")?.jsonObject
                ?.get("model")?.clean ?: "classic"

            Pair(client.get(url).readRawBytes(), model)
        }
    }

    private fun bedrock(name: String): Pair<ByteArray, String> {
        return runBlocking {
            // get player info
            val pInfoResponse: HttpResponse = client.get("https://api.geysermc.org/v2/xbox/xuid/$name")

            if (pInfoResponse.status != HttpStatusCode.OK) return@runBlocking Pair(client.get(DEFAULTSKIN).readRawBytes(), "classic")

            val pInfo: JsonObject = pInfoResponse.body()
            // get player skin
            val profileResponse: HttpResponse = client.get("https://api.geysermc.org/v2/skin/${pInfo["xuid"]?.clean}")

            if (profileResponse.status != HttpStatusCode.OK) return@runBlocking Pair(client.get(DEFAULTSKIN).readRawBytes(), "classic")

            val profile: JsonObject = profileResponse.body() // get skin info

            val url = "http://textures.minecraft.net/texture/${profile["texture_id"]?.clean ?: DEFAULTID}"
            val model = if (profile["is_steve"]?.clean == "true" || profile["is_steve"] == null)
                "classic" else "slim"

            Pair(client.get(url).readRawBytes(), model)
        }
    }
}