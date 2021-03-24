

- InputStream.pushCheckPoint(), InputStream.popCheckPoint()
-> can be turned to InputStream.test((stream) => any | null)
-> pushing the checkpoint before calling the test-fn, if it returns null, the checkpoint will be popped

- currently not possible (Variable amount of comma separated values and then at the end also another pattern with comma separated):
"1", "2", "3", "4", "lol", "> last one extra handled <"