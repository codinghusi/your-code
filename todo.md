

- InputStream.pushCheckPoint(), InputStream.popCheckPoint()
-> can be turned to InputStream.test((stream) => any | null)
-> pushing the checkpoint before calling the test-fn, if it returns null, the checkpoint will be popped