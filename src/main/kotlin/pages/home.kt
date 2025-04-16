package com.maltsburg.pages

import io.github.allangomes.kotlinwind.css.I900
import io.github.allangomes.kotlinwind.css.I500
import kotlinx.html.*
import io.github.allangomes.kotlinwind.css.kw

fun HTML.home() {
    head {
        title { +"Skin API" }
        link("/head/maltsburg", "icon")
    }

    body {
        style = kw.inline {
            background.gray[I500]
            flex.col.gap[3].items_center.justify_center
        }

        val renderSection = { path: String ->
            val route = path.substringBefore("/{")
            val imageSrc = "$route/maltsburg"

            div {
                style = kw.inline {
                    padding[8]
                    width[100]
                    background.red[I900]
                    flex.row.gap[3].items_center.justify_center
                }
                img { src = imageSrc }
                h3 {
                    code {
                        style = kw.inline {
                            background.gray[I500]
                            flex.row.items_center.justify_center
                        }
                        +path
                    }
                }
            }
        }

        renderSection("/skin/{name}")
        renderSection("/body/{name}/{size}")
        renderSection("/torso/{name}/{size}")
        renderSection("/head/{name}/{size}")

        footer {
            style = kw.inline {
                text.white
                flex.row.items_center.justify_center
            }
            a {
                href = "https://github.com/Maltsburg"
                target = "_blank"
                +"GitHub"
            }
        }

    }
}