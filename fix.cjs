const fs = require('fs');
const path = require('path');

const pathfixes = [
  { p: 'src/services/eventService.ts', r: "import type { Event, Review } from '../types';" },
  { p: 'src/services/transactionService.ts', r: "import type { Order, DashboardStats } from '../types';" },
  { p: 'src/context/AuthContext.tsx', r: "import type { User } from '../types';" },
  { p: 'src/components/ui/EventCard.tsx', r: "import type { Event } from '../../types';" },
  { p: 'src/pages/event/Home.tsx', r: "import type { Event } from '../../types';" },
  { p: 'src/pages/event/EventDetail.tsx', r: "import type { Event, Review } from '../../types';" },
  { p: 'src/pages/order/Transactions.tsx', r: "import type { Order } from '../../types';" },
  { p: 'src/pages/dashboard/Dashboard.tsx', r: "import type { DashboardStats } from '../../types';" }
];

pathfixes.forEach(f => {
  const filepath = path.join(__dirname, f.p);
  if (fs.existsSync(filepath)) {
    let content = fs.readFileSync(filepath, 'utf8');
    // We replace the broken import line
    content = content.replace(/import type \{  \} from '';/g, f.r);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Fixed', f.p);
  }
});
