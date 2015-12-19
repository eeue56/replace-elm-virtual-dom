module Main where

import FakeVirtualDom exposing (create, initGraphics)
import Convert exposing (toHtml)

import Html exposing (div, text)

aDiv = create "div" |> toHtml

main' =
    initGraphics
        <| Signal.map (\_ -> div [] [ text "hello dave" ]) (Signal.constant 1)
