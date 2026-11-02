export const SITE = { name: 'Roomtally', url: 'https://roomtally.top', domain: 'roomtally.top', email: 'tunde@roomtally.top' };

export interface Person {
  name: string;
  initials: string;
  role: string;
  email?: string;
  bio: string;
  focus: string[];
}

/** The founding team, credited on the home page, About, Contact and in the footer. */
export const FOUNDERS: Person[] = [
  {
    name: 'Tunde Ogunleye',
    initials: 'TO',
    role: 'Founder/CEO',
    email: SITE.email,
    bio: 'Tunde founded Roomtally to bring structure to the part of a workplace move that is usually handled last and in a hurry — and leads product, customers and every pilot.',
    focus: ['Product', 'Customers', 'Pilots'],
  },
  {
    name: 'Yusuf Abdulhamid',
    initials: 'YA',
    role: 'Co-founder/CTO',
    bio: 'Yusuf co-founded Roomtally and leads its technology — from survey capture and duplicate review to the planning board and the cloud platform it runs on.',
    focus: ['Survey capture', 'Inventory engine', 'Cloud platform'],
  },
];
