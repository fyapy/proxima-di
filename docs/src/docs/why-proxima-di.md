# Why Proxima-di

## Introduction

Proxima-di started as experiment to design NodeJS native DI implementation.

## Problem and solution

When I had to use solutions such as [TydeDI](https://docs.typestack.community/typedi/v/develop/) or [InversifyJS](https://inversify.io/), everything was fine, until during the development of the project it grew into a large monolith and became very slow in terms of build speed. The main problem was the speed of JS code traspilation, but the solution could be replacing Babel trasprayler with [ESbuild](https://esbuild.github.io/)/[SWC](https://swc.rs/). But since they rely on unstable decorators and reflect-metadata together with the emitDecoratorMetadata flag, this did not make it so easy to replace Babel with [ESbuild](https://esbuild.github.io/)/[SWC](https://swc.rs/), and in search of this solution, I came to a completely native implementation of the DI container in NodeJS, which uses ES6 Proxy internally to access services.
