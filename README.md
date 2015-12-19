# Define your own main method with Elm

`main` at the moment in Elm is bound to either `VirtualDom` or `Graphics.Element`.

This package implements a solution allows you to get around this limitation by defining a `main'` function like below:

```
main' =
    initGraphics
        <| Signal.map (\_ -> div [] [ text "hello dave" ]) (Signal.constant 1)
```


This is entirely PoC and not recommended for production use.
