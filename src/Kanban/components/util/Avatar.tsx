import { Issue as IssueType } from '../../types/Issue';

interface Props {
  src?: string;
  name: string;
  title?: string;
  className?: string;
  onClick?: () => void;
  style?: {};
  issue?: IssueType;
}

function Avatar(props: Props) {
  const { src, name, title, className, onClick, style } = props;
  let firstWord = ""
  firstWord += name.at(0)?.toUpperCase();
  firstWord += name.at(1)?.toUpperCase();
  let color = firstWord ? getColorFromName(firstWord) : 'bg-green-600';
  
  return (
    <div
      className={`relative grid shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full ${color}  ${
        className ?? 'h-8 w-8 border-[1px]'
      }`}
      title={title ?? name}
      {...{ style, onClick }}
    >
      <div>{firstWord}</div>
      {src && <img src={src} alt={name} className='absolute block h-full w-full object-cover' />}
      
    </div>
  );
}

const colorMap = {
  'a': 'bg-blue-200',
  'b': 'bg-red-400',
  'c': 'bg-green-600',
  'd': 'bg-yellow-600',
  'e': 'bg-pink-600',
  'f': 'bg-purple-600',
  'g': 'bg-indigo-600',
  'h': 'bg-blue-300',
  'i': 'bg-red-600',
  'j': 'bg-green-700',
  'k': 'bg-yellow-700',
  'l': 'bg-pink-400',
  'm': 'bg-purple-700',
  'n': 'bg-indigo-700',
  'o': 'bg-blue-500',
  'p': 'bg-red-800',
  'q': 'bg-green-800',
  'r': 'bg-yellow-400',
  's': 'bg-pink-200',
  't': 'bg-purple-300',
  'u': 'bg-indigo-300',
  'v': 'bg-blue-700',
  'w': 'bg-red-900',
  'x': 'bg-green-400',
  'y': 'bg-yellow-200',
  'z': 'bg-pink-700',
};

function getColorFromName(firstChar?: string) {
  if (!firstChar) return;
  let hash = Math.abs(hashString(firstChar));
  let hashedChar = getFirstLetter(hash)[0];
  firstChar = hashedChar.toLowerCase();
  if (colorMap.hasOwnProperty(firstChar)) {
    return colorMap[firstChar as keyof typeof colorMap];
  } else {
    return 'bg-gray-600';
  }
}

function hashString(str: string): number {
  let hash = 0;
  if (str.length === 0) {
      return hash;
  }
  for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; 
  }
  return hash;
}

function getFirstLetter(hash: number): string {
  const letterIndex = Math.abs(hash) % 26; // Mapeia o hash para um número entre 0 e 25
  const charCode = letterIndex + 97; // Mapeia o número para o código Unicode de uma letra minúscula
  return String.fromCharCode(charCode); // Retorna a letra como uma string
}

export default Avatar;
