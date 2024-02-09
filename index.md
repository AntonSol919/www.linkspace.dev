# Introduction 

Linkspace is a open-source MPL-2.0 library and protocol to build event-driven applications using a distributed log with bindings for Python, JS/Wasm, and Rust.

Linkspace is a set of tools for building fast and efficient distributed systems.

Most contemporary tools are focused on modeling and building programs using streams-of-data.
The goal of linkspace is to make it easy to build using hashed packets that can be signed and named.

This perspective is more in tune with the physics of the CAP theorem, the speed of light, and data accessibility.

It lets us talk about data instead of at servers.

Tools like Git, nostr, bluesky, IPFS, and many others share some of these ideas.
Linkspace is different in that its goal is a simple and clear API adaptable to any group and use-case.

It is my bet on re-usability, speed, and interlinking for the next generation of networked people.

## Project status

The packet format is stable and will stay readable in all future versions.
The API is mostly stable but can have breaking changes between versions.

Any questions, feedback, or contributions are welcome!

## Links

See [Quick Start](https://www.linkspace.dev/code_intro.html) for a bash introduction to the packet format and using the cli tool.
The [Guide](https://www.linkspace.dev/guide/index.html) goes into more depth on the API and technical design.
[Tutorials](https://www.linkspace.dev/tutorial/index.html) has some annotated examples.


## Using linkspace

[Download](https://github.com/AntonSol919/linkspace/releases) the latest binary package to try out some examples.

### As a library 

All bindings follow the same basic API explained in the [Guide](https://www.linkspace.dev/guide/index.html)

- `cargo add linkspace --git "https://github.com/AntonSol919/linkspace"` - disable default features to compile for --target wasm32-unknown-unknown
- `pip install linkspace`
- `npm add linkspace-js` - Minimal JS bindings to read/write packets (including enckeys)
