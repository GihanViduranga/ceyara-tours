// Mock React compiler-runtime for React 18 compatibility
// This provides the missing compiler-runtime that Payload CMS 3.0.0 expects

import { 
  useMemo as ReactUseMemo,
  useCallback as ReactUseCallback,
  useState as ReactUseState,
  useEffect as ReactUseEffect,
  useRef as ReactUseRef,
  useContext as ReactUseContext,
  useReducer as ReactUseReducer,
  useLayoutEffect as ReactUseLayoutEffect,
  useImperativeHandle as ReactUseImperativeHandle,
  useDebugValue as ReactUseDebugValue,
  useDeferredValue as ReactUseDeferredValue,
  useTransition as ReactUseTransition,
  useId as ReactUseId,
  useSyncExternalStore as ReactUseSyncExternalStore,
  useInsertionEffect as ReactUseInsertionEffect,
} from 'react'

// React 19 compiler functions that Payload CMS expects
export const c = (fn) => {
  // Mock implementation - just return the function
  return fn
}

export const useMemoCache = () => {
  // Mock implementation for React 18
  return []
}

export const useMemo = (factory, deps) => {
  // Fallback to React's useMemo
  return ReactUseMemo(factory, deps)
}

export const useCallback = (callback, deps) => {
  // Fallback to React's useCallback
  return ReactUseCallback(callback, deps)
}

export const useState = (initialState) => {
  // Fallback to React's useState
  return ReactUseState(initialState)
}

export const useEffect = (effect, deps) => {
  // Fallback to React's useEffect
  return ReactUseEffect(effect, deps)
}

export const useRef = (initialValue) => {
  // Fallback to React's useRef
  return ReactUseRef(initialValue)
}

export const useContext = (context) => {
  // Fallback to React's useContext
  return ReactUseContext(context)
}

export const useReducer = (reducer, initialState, init) => {
  // Fallback to React's useReducer
  return ReactUseReducer(reducer, initialState, init)
}

export const useLayoutEffect = (effect, deps) => {
  // Fallback to React's useLayoutEffect
  return ReactUseLayoutEffect(effect, deps)
}

export const useImperativeHandle = (ref, createHandle, deps) => {
  // Fallback to React's useImperativeHandle
  return ReactUseImperativeHandle(ref, createHandle, deps)
}

export const useDebugValue = (value, formatter) => {
  // Fallback to React's useDebugValue
  return ReactUseDebugValue(value, formatter)
}

export const useDeferredValue = (value) => {
  // Fallback to React's useDeferredValue
  return ReactUseDeferredValue(value)
}

export const useTransition = () => {
  // Fallback to React's useTransition
  return ReactUseTransition()
}

export const useId = () => {
  // Fallback to React's useId
  return ReactUseId()
}

export const useSyncExternalStore = (subscribe, getSnapshot, getServerSnapshot) => {
  // Fallback to React's useSyncExternalStore
  return ReactUseSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export const useInsertionEffect = (effect, deps) => {
  // Fallback to React's useInsertionEffect
  return ReactUseInsertionEffect(effect, deps)
}

// Export all as default
export default {
  c,
  useMemoCache,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
  useContext,
  useReducer,
  useLayoutEffect,
  useImperativeHandle,
  useDebugValue,
  useDeferredValue,
  useTransition,
  useId,
  useSyncExternalStore,
  useInsertionEffect,
}
