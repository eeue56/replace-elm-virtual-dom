module Convert where

import Html
import Native.FakeVirtualDom

toHtml : a -> Html.Html
toHtml = Native.FakeVirtualDom.toHtml
