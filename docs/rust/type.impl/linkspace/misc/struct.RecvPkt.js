(function() {var type_impls = {
"linkspace":[["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-RecvPkt%3CA%3E\" class=\"impl\"><a href=\"#impl-RecvPkt%3CA%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;A&gt; <a class=\"struct\" href=\"linkspace/misc/struct.RecvPkt.html\" title=\"struct linkspace::misc::RecvPkt\">RecvPkt</a>&lt;A&gt;</h3></section></summary><div class=\"impl-items\"><section id=\"method.from_dyn\" class=\"method\"><h4 class=\"code-header\">pub fn <a href=\"linkspace/misc/struct.RecvPkt.html#tymethod.from_dyn\" class=\"fn\">from_dyn</a>(pkt: &amp;dyn <a class=\"trait\" href=\"linkspace/prelude/trait.NetPkt.html\" title=\"trait linkspace::prelude::NetPkt\">NetPkt</a>) -&gt; <a class=\"struct\" href=\"linkspace/misc/struct.RecvPkt.html\" title=\"struct linkspace::misc::RecvPkt\">RecvPkt</a>&lt;A&gt; <a href=\"#\" class=\"tooltip\" data-notable-ty=\"RecvPkt&lt;A&gt;\">ⓘ</a><span class=\"where fmt-newline\">where\n    A: for&lt;'o&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/nightly/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;&amp;'o dyn <a class=\"trait\" href=\"linkspace/prelude/trait.NetPkt.html\" title=\"trait linkspace::prelude::NetPkt\">NetPkt</a>&gt;,</span></h4></section><section id=\"method.map\" class=\"method\"><h4 class=\"code-header\">pub fn <a href=\"linkspace/misc/struct.RecvPkt.html#tymethod.map\" class=\"fn\">map</a>&lt;B&gt;(self, fnc: impl <a class=\"trait\" href=\"https://doc.rust-lang.org/nightly/core/ops/function/trait.FnOnce.html\" title=\"trait core::ops::function::FnOnce\">FnOnce</a>(A) -&gt; B) -&gt; <a class=\"struct\" href=\"linkspace/misc/struct.RecvPkt.html\" title=\"struct linkspace::misc::RecvPkt\">RecvPkt</a>&lt;B&gt; <a href=\"#\" class=\"tooltip\" data-notable-ty=\"RecvPkt&lt;B&gt;\">ⓘ</a></h4></section><section id=\"method.owned\" class=\"method\"><h4 class=\"code-header\">pub fn <a href=\"linkspace/misc/struct.RecvPkt.html#tymethod.owned\" class=\"fn\">owned</a>(self) -&gt; <a class=\"struct\" href=\"linkspace/misc/struct.RecvPkt.html\" title=\"struct linkspace::misc::RecvPkt\">RecvPkt</a> <a href=\"#\" class=\"tooltip\" data-notable-ty=\"RecvPkt\">ⓘ</a><span class=\"where fmt-newline\">where\n    A: <a class=\"trait\" href=\"linkspace/prelude/trait.NetPkt.html\" title=\"trait linkspace::prelude::NetPkt\">NetPkt</a>,</span></h4></section></div></details>",0,"linkspace::prelude::RecvPktPtr"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-Clone-for-RecvPkt%3CT%3E\" class=\"impl\"><a href=\"#impl-Clone-for-RecvPkt%3CT%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;T&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/nightly/core/clone/trait.Clone.html\" title=\"trait core::clone::Clone\">Clone</a> for <a class=\"struct\" href=\"linkspace/misc/struct.RecvPkt.html\" title=\"struct linkspace::misc::RecvPkt\">RecvPkt</a>&lt;T&gt;<span class=\"where fmt-newline\">where\n    T: <a class=\"trait\" href=\"https://doc.rust-lang.org/nightly/core/clone/trait.Clone.html\" title=\"trait core::clone::Clone\">Clone</a> + ?<a class=\"trait\" href=\"https://doc.rust-lang.org/nightly/core/marker/trait.Sized.html\" title=\"trait core::marker::Sized\">Sized</a>,</span></h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.clone\" class=\"method trait-impl\"><a href=\"#method.clone\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/nightly/core/clone/trait.Clone.html#tymethod.clone\" class=\"fn\">clone</a>(&amp;self) -&gt; <a class=\"struct\" href=\"linkspace/misc/struct.RecvPkt.html\" title=\"struct linkspace::misc::RecvPkt\">RecvPkt</a>&lt;T&gt; <a href=\"#\" class=\"tooltip\" data-notable-ty=\"RecvPkt&lt;T&gt;\">ⓘ</a></h4></section></summary><div class='docblock'>Returns a copy of the value. <a href=\"https://doc.rust-lang.org/nightly/core/clone/trait.Clone.html#tymethod.clone\">Read more</a></div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.clone_from\" class=\"method trait-impl\"><span class=\"rightside\"><span class=\"since\" title=\"Stable since Rust version 1.0.0\">1.0.0</span> · <a class=\"src\" href=\"https://doc.rust-lang.org/nightly/src/core/clone.rs.html#169\">source</a></span><a href=\"#method.clone_from\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/nightly/core/clone/trait.Clone.html#method.clone_from\" class=\"fn\">clone_from</a>(&amp;mut self, source: <a class=\"primitive\" href=\"https://doc.rust-lang.org/nightly/std/primitive.reference.html\">&amp;Self</a>)</h4></section></summary><div class='docblock'>Performs copy-assignment from <code>source</code>. <a href=\"https://doc.rust-lang.org/nightly/core/clone/trait.Clone.html#method.clone_from\">Read more</a></div></details></div></details>","Clone","linkspace::prelude::RecvPktPtr"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-Deref-for-RecvPkt%3CT%3E\" class=\"impl\"><a href=\"#impl-Deref-for-RecvPkt%3CT%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;T&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/nightly/core/ops/deref/trait.Deref.html\" title=\"trait core::ops::deref::Deref\">Deref</a> for <a class=\"struct\" href=\"linkspace/misc/struct.RecvPkt.html\" title=\"struct linkspace::misc::RecvPkt\">RecvPkt</a>&lt;T&gt;<span class=\"where fmt-newline\">where\n    T: ?<a class=\"trait\" href=\"https://doc.rust-lang.org/nightly/core/marker/trait.Sized.html\" title=\"trait core::marker::Sized\">Sized</a>,</span></h3></section></summary><div class=\"impl-items\"><details class=\"toggle\" open><summary><section id=\"associatedtype.Target\" class=\"associatedtype trait-impl\"><a href=\"#associatedtype.Target\" class=\"anchor\">§</a><h4 class=\"code-header\">type <a href=\"https://doc.rust-lang.org/nightly/core/ops/deref/trait.Deref.html#associatedtype.Target\" class=\"associatedtype\">Target</a> = T</h4></section></summary><div class='docblock'>The resulting type after dereferencing.</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.deref\" class=\"method trait-impl\"><a href=\"#method.deref\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/nightly/core/ops/deref/trait.Deref.html#tymethod.deref\" class=\"fn\">deref</a>(&amp;self) -&gt; &amp;&lt;<a class=\"struct\" href=\"linkspace/misc/struct.RecvPkt.html\" title=\"struct linkspace::misc::RecvPkt\">RecvPkt</a>&lt;T&gt; as <a class=\"trait\" href=\"https://doc.rust-lang.org/nightly/core/ops/deref/trait.Deref.html\" title=\"trait core::ops::deref::Deref\">Deref</a>&gt;::<a class=\"associatedtype\" href=\"https://doc.rust-lang.org/nightly/core/ops/deref/trait.Deref.html#associatedtype.Target\" title=\"type core::ops::deref::Deref::Target\">Target</a> <a href=\"#\" class=\"tooltip\" data-notable-ty=\"&amp;&lt;RecvPkt&lt;T&gt; as Deref&gt;::Target\">ⓘ</a></h4></section></summary><div class='docblock'>Dereferences the value.</div></details></div></details>","Deref","linkspace::prelude::RecvPktPtr"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-Debug-for-RecvPkt%3CT%3E\" class=\"impl\"><a href=\"#impl-Debug-for-RecvPkt%3CT%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;T&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/nightly/core/fmt/trait.Debug.html\" title=\"trait core::fmt::Debug\">Debug</a> for <a class=\"struct\" href=\"linkspace/misc/struct.RecvPkt.html\" title=\"struct linkspace::misc::RecvPkt\">RecvPkt</a>&lt;T&gt;<span class=\"where fmt-newline\">where\n    T: <a class=\"trait\" href=\"https://doc.rust-lang.org/nightly/core/fmt/trait.Debug.html\" title=\"trait core::fmt::Debug\">Debug</a> + ?<a class=\"trait\" href=\"https://doc.rust-lang.org/nightly/core/marker/trait.Sized.html\" title=\"trait core::marker::Sized\">Sized</a>,</span></h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.fmt\" class=\"method trait-impl\"><a href=\"#method.fmt\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/nightly/core/fmt/trait.Debug.html#tymethod.fmt\" class=\"fn\">fmt</a>(&amp;self, f: &amp;mut <a class=\"struct\" href=\"https://doc.rust-lang.org/nightly/core/fmt/struct.Formatter.html\" title=\"struct core::fmt::Formatter\">Formatter</a>&lt;'_&gt;) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/nightly/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/nightly/std/primitive.unit.html\">()</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/nightly/core/fmt/struct.Error.html\" title=\"struct core::fmt::Error\">Error</a>&gt;</h4></section></summary><div class='docblock'>Formats the value using the given formatter. <a href=\"https://doc.rust-lang.org/nightly/core/fmt/trait.Debug.html#tymethod.fmt\">Read more</a></div></details></div></details>","Debug","linkspace::prelude::RecvPktPtr"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-NetPkt-for-RecvPkt%3CT%3E\" class=\"impl\"><a href=\"#impl-NetPkt-for-RecvPkt%3CT%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;T&gt; <a class=\"trait\" href=\"linkspace/prelude/trait.NetPkt.html\" title=\"trait linkspace::prelude::NetPkt\">NetPkt</a> for <a class=\"struct\" href=\"linkspace/misc/struct.RecvPkt.html\" title=\"struct linkspace::misc::RecvPkt\">RecvPkt</a>&lt;T&gt;<span class=\"where fmt-newline\">where\n    T: <a class=\"trait\" href=\"linkspace/prelude/trait.NetPkt.html\" title=\"trait linkspace::prelude::NetPkt\">NetPkt</a> + ?<a class=\"trait\" href=\"https://doc.rust-lang.org/nightly/core/marker/trait.Sized.html\" title=\"trait core::marker::Sized\">Sized</a>,</span></h3></section></summary><div class=\"impl-items\"><section id=\"method.hash_ref\" class=\"method trait-impl\"><a href=\"#method.hash_ref\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"linkspace/prelude/trait.NetPkt.html#tymethod.hash_ref\" class=\"fn\">hash_ref</a>(&amp;self) -&gt; &amp;<a class=\"struct\" href=\"linkspace/prelude/struct.B64.html\" title=\"struct linkspace::prelude::B64\">B64</a></h4></section><details class=\"toggle method-toggle\" open><summary><section id=\"method.recv\" class=\"method trait-impl\"><a href=\"#method.recv\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"linkspace/prelude/trait.NetPkt.html#tymethod.recv\" class=\"fn\">recv</a>(&amp;self) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/nightly/core/option/enum.Option.html\" title=\"enum core::option::Option\">Option</a>&lt;<a class=\"struct\" href=\"linkspace/prelude/endian_types/struct.U64.html\" title=\"struct linkspace::prelude::endian_types::U64\">U64</a>&gt;</h4></section></summary><div class='docblock'>recv is somewhat special.\nIt depends on the context. Reading directly from the database it should return the stamp at which it was inserted.\nNOTE: Do not rely on this value being unique - in the db or otherwise.</div></details><section id=\"method.net_header_ref\" class=\"method trait-impl\"><a href=\"#method.net_header_ref\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"linkspace/prelude/trait.NetPkt.html#tymethod.net_header_ref\" class=\"fn\">net_header_ref</a>(&amp;self) -&gt; &amp;<a class=\"struct\" href=\"linkspace/prelude/struct.NetPktHeader.html\" title=\"struct linkspace::prelude::NetPktHeader\">NetPktHeader</a></h4></section><section id=\"method.byte_segments\" class=\"method trait-impl\"><a href=\"#method.byte_segments\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"linkspace/prelude/trait.NetPkt.html#tymethod.byte_segments\" class=\"fn\">byte_segments</a>(&amp;self) -&gt; ByteSegments&lt;'_&gt;</h4></section><section id=\"method.as_point\" class=\"method trait-impl\"><a href=\"#method.as_point\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"linkspace/prelude/trait.NetPkt.html#tymethod.as_point\" class=\"fn\">as_point</a>(&amp;self) -&gt; &amp;dyn <a class=\"trait\" href=\"linkspace/prelude/trait.Point.html\" title=\"trait linkspace::prelude::Point\">Point</a></h4></section><section id=\"method.net_header_mut\" class=\"method trait-impl\"><a href=\"#method.net_header_mut\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"linkspace/prelude/trait.NetPkt.html#method.net_header_mut\" class=\"fn\">net_header_mut</a>(&amp;mut self) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/nightly/core/option/enum.Option.html\" title=\"enum core::option::Option\">Option</a>&lt;&amp;mut <a class=\"struct\" href=\"linkspace/prelude/struct.NetPktHeader.html\" title=\"struct linkspace::prelude::NetPktHeader\">NetPktHeader</a>&gt;</h4></section><section id=\"method.as_netbox\" class=\"method trait-impl\"><a href=\"#method.as_netbox\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"linkspace/prelude/trait.NetPkt.html#method.as_netbox\" class=\"fn\">as_netbox</a>(&amp;self) -&gt; <a class=\"struct\" href=\"https://doc.rust-lang.org/nightly/alloc/boxed/struct.Box.html\" title=\"struct alloc::boxed::Box\">Box</a>&lt;NetPktFatPtr&gt;</h4></section><section id=\"method.as_netarc\" class=\"method trait-impl\"><a href=\"#method.as_netarc\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"linkspace/prelude/trait.NetPkt.html#method.as_netarc\" class=\"fn\">as_netarc</a>(&amp;self) -&gt; <a class=\"struct\" href=\"linkspace/prelude/struct.NetPktArc.html\" title=\"struct linkspace::prelude::NetPktArc\">NetPktArc</a> <a href=\"#\" class=\"tooltip\" data-notable-ty=\"NetPktArc\">ⓘ</a></h4></section></div></details>","NetPkt","linkspace::prelude::RecvPktPtr"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-From%3C%26dyn+NetPkt%3E-for-RecvPkt%3CA%3E\" class=\"impl\"><a href=\"#impl-From%3C%26dyn+NetPkt%3E-for-RecvPkt%3CA%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;A&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/nightly/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;&amp;dyn <a class=\"trait\" href=\"linkspace/prelude/trait.NetPkt.html\" title=\"trait linkspace::prelude::NetPkt\">NetPkt</a>&gt; for <a class=\"struct\" href=\"linkspace/misc/struct.RecvPkt.html\" title=\"struct linkspace::misc::RecvPkt\">RecvPkt</a>&lt;A&gt;<span class=\"where fmt-newline\">where\n    A: for&lt;'o&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/nightly/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;&amp;'o dyn <a class=\"trait\" href=\"linkspace/prelude/trait.NetPkt.html\" title=\"trait linkspace::prelude::NetPkt\">NetPkt</a>&gt;,</span></h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.from\" class=\"method trait-impl\"><a href=\"#method.from\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/nightly/core/convert/trait.From.html#tymethod.from\" class=\"fn\">from</a>(value: &amp;dyn <a class=\"trait\" href=\"linkspace/prelude/trait.NetPkt.html\" title=\"trait linkspace::prelude::NetPkt\">NetPkt</a>) -&gt; <a class=\"struct\" href=\"linkspace/misc/struct.RecvPkt.html\" title=\"struct linkspace::misc::RecvPkt\">RecvPkt</a>&lt;A&gt; <a href=\"#\" class=\"tooltip\" data-notable-ty=\"RecvPkt&lt;A&gt;\">ⓘ</a></h4></section></summary><div class='docblock'>Converts to this type from the input type.</div></details></div></details>","From<&dyn NetPkt>","linkspace::prelude::RecvPktPtr"],["<section id=\"impl-Copy-for-RecvPkt%3CT%3E\" class=\"impl\"><a href=\"#impl-Copy-for-RecvPkt%3CT%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;T&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/nightly/core/marker/trait.Copy.html\" title=\"trait core::marker::Copy\">Copy</a> for <a class=\"struct\" href=\"linkspace/misc/struct.RecvPkt.html\" title=\"struct linkspace::misc::RecvPkt\">RecvPkt</a>&lt;T&gt;<span class=\"where fmt-newline\">where\n    T: <a class=\"trait\" href=\"https://doc.rust-lang.org/nightly/core/marker/trait.Copy.html\" title=\"trait core::marker::Copy\">Copy</a> + ?<a class=\"trait\" href=\"https://doc.rust-lang.org/nightly/core/marker/trait.Sized.html\" title=\"trait core::marker::Sized\">Sized</a>,</span></h3></section>","Copy","linkspace::prelude::RecvPktPtr"]]
};if (window.register_type_impls) {window.register_type_impls(type_impls);} else {window.pending_type_impls = type_impls;}})()