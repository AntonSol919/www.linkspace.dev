
Web-sign is a simple form of "third party" authentication.
Instead of integrating Google, Facebook, auth you generate a plain http link to this page.
By redirecting your users here they can accept and send you a signed keypoint with fields passed in the url parameters.

The user's identity is stored on this domain / webpage.
The hassle of password security, identification, and authentication lives in their browser. 

As such you can avoid the tedious parts of building a network service.
You just have to setup an endpoint that accepts a linkspace packet and triggers whatever.

# Example

Its main use is that when you want to quickly build a network service, for instance a shared media playlist, 
you can this web url to avoid dealing with the tedious parts of identification & authentication.

