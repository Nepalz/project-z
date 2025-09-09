// Nepalese revolutionaries and freedom fighters who fought for change
const nepaleseRevolutionaries = [
  'Lakhan_Thapa', // First martyr of Nepal
  'Dharma_Bhakta', // Revolutionary leader
  'Gangalal_Shrestha', // Martyr of democracy movement
  'Dasharath_Chand', // Freedom fighter
  'Shukra_Raj_Shastri', // Scholar and revolutionary
  'Tanka_Prasad_Acharya', // Democratic leader
  'Bishweshwar_Prasad', // Political revolutionary
  'Ram_Prasad_Bismil', // Revolutionary poet
  'Pushpa_Lal_Shrestha', // Communist leader
  'Man_Mohan_Adhikari', // Democratic socialist
  'Krishna_Prasad_Bhattarai', // Democracy activist
  'Girija_Prasad_Koirala', // Democratic leader
  'Mahendra_Lawoti', // Social revolutionary
  'Baburam_Bhattarai', // Modern revolutionary
  'Prachanda_Warrior', // Revolutionary commander
  'Jhala_Nath_Khanal', // Political leader
  'Madhav_Kumar_Nepal', // Democratic leader
  'Sher_Bahadur_Deuba', // Political reformer
  'Biraj_Bhakta_Shrestha', // Freedom fighter
  'Jeev_Raj_Ashrit', // Democratic activist
  'Bhim_Datta_Pant', // Revolutionary thinker
  'Bhanubhakta_Revolutionary', // Cultural revolutionary
  'Prithvi_Narayan_Reformer', // Historical reformer
  'Amar_Singh_Thapa', // Military revolutionary
  'Bal_Bhadra_Kunwar', // Brave warrior
  'Bhakti_Thapa_Fighter', // Freedom fighter
  'Kalu_Pande_Revolutionary', // Military leader
  'Mukunda_Sen_Warrior', // Ancient warrior
  'Drabya_Shah_Reformer', // Historical king reformer
  'Ram_Shah_Justice', // Justice reformer
];

const adjectives = [
  'Brave', 'Fearless', 'Bold', 'Mighty', 'Swift', 'Strong', 'Wise', 'Noble',
  'Fierce', 'Proud', 'Free', 'Rising', 'Thunder', 'Mountain', 'Eagle', 'Tiger',
  'Dragon', 'Phoenix', 'Storm', 'Lightning', 'Flame', 'Steel', 'Diamond', 'Gold'
];

export function generateRevolutionaryUsername(): string {
  const revolutionary = nepaleseRevolutionaries[Math.floor(Math.random() * nepaleseRevolutionaries.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNumber = Math.floor(Math.random() * 999) + 1;
  
  // Create different username patterns
  const patterns = [
    `${adjective}_${revolutionary}_${randomNumber}`,
    `${revolutionary}_${adjective}${randomNumber}`,
    `${adjective}${randomNumber}_${revolutionary}`,
    `Revolutionary_${revolutionary}_${randomNumber}`,
    `${revolutionary}_Fighter_${randomNumber}`
  ];
  
  const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
  return selectedPattern;
}

export async function generateUniqueUsername(prisma: any): Promise<string> {
  let attempts = 0;
  const maxAttempts = 50;
  
  while (attempts < maxAttempts) {
    const username = generateRevolutionaryUsername();
    
    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });
    
    if (!existingUser) {
      return username;
    }
    
    attempts++;
  }
  
  // Fallback with timestamp if all attempts failed
  const timestamp = Date.now();
  return `Revolutionary_Fighter_${timestamp}`;
}
