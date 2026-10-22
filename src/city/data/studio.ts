/** Objects in Sophia's studio, each standing for something she does outside work. */
export interface StudioObject {
  id: 'camera' | 'notebook' | 'suitcase' | 'table' | 'workbench';
  name: string;
  kicker: string;
  summary: string;
}

export const studioObjects: StudioObject[] = [
  {
    id: 'camera',
    name: 'Photography',
    kicker: 'The camera',
    summary: 'My newest hobby. Still learning, and loving it.',
  },
  {
    id: 'notebook',
    name: 'Writing',
    kicker: 'The notebook',
    summary: 'I write short stories and poems.',
  },
  {
    id: 'suitcase',
    name: 'Travel',
    kicker: 'The suitcase',
    summary: 'Favorite places I’ve been so far: Aruba and Switzerland.',
  },
  {
    id: 'table',
    name: 'Sports',
    kicker: 'The ping pong table',
    summary: 'Volleyball, tennis, pickleball, ping pong. Always down to learn a new sport, except soccer. Two left feet.',
  },
  {
    id: 'workbench',
    name: 'Making',
    kicker: 'The workbench',
    summary: 'Small projects I build just for me. They’re what keep coding fun.',
  },
];
