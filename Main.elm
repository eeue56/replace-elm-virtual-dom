module Main where

import FakeVirtualDom exposing (create)
import Convert exposing (toHtml)

aDiv = create "div" |> toHtml

main = aDiv
