module FakeVirtualDom where

import Native.FakeVirtualDom

_ = 5

type Html = Html


create : String -> Html
create name =
    Native.FakeVirtualDom.createNode name

initGraphics : Signal a -> ()
initGraphics =
    Native.FakeVirtualDom.initGraphics
