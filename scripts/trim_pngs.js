import fs from 'node:fs'

fs.writeFileSync('scripts/test_marker.txt', 'HELLO_TEST_RAN_' + Date.now())
console.log('test ran successfully!')
