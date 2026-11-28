import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const t = fs.readFileSync(path.join(root, 'src/data/portfolioApprovedProjects.js'), 'utf8')
const o = {
  approved: (t.match(/"publicationApproved": true/g) || []).length,
  csTrue: (t.match(/"hasCaseStudy": true/g) || []).length,
  csFalse: (t.match(/"hasCaseStudy": false/g) || []).length,
  slugCount: (t.match(/"slug":/g) || []).length,
}
console.log(JSON.stringify(o, null, 2))
