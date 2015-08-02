# Changelog

## 1.1.0
Refactored stemming and stop-word support to be based on `ITokenizer` decorators for better accuracy.
Updated README examples with more info.

## 1.0.2
Added `JsSearch` module wrapper around library and renamed `JsSearch` class to `Search`.
Added stemming support by way of the new `StemmingSanitizerDecorator` class.

## 1.0.1
Renamed `WhitespaceTokenizer` to `SimpleTokenizer` and added better support for punctuation.
Added `StopWordsIndexStrategyDecorator` to support stop words filtering.

## 1.0.0
Initial release!