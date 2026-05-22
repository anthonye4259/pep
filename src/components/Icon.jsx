import {
  IoMedkit, IoFlask, IoColorPalette, IoScale, IoTrendingUp,
  IoFitness, IoHeart, IoShield, IoPulse,
  IoFlash, IoLeaf, IoBandage,
  IoBarbell, IoMedical, IoWater, IoSparkles, IoCube
} from 'react-icons/io5';

const iconMap = {
  'medkit': IoMedkit,
  'flask': IoFlask,
  'color-palette': IoColorPalette,
  'scale': IoScale,
  'trending-up': IoTrendingUp,
  'fitness': IoFitness,
  'heart': IoHeart,
  'shield': IoShield,
  'nucleus': IoFlask,
  'pulse': IoPulse,
  'flash': IoFlash,
  'leaf': IoLeaf,
  'bandage': IoBandage,
  'barbell': IoBarbell,
  'medical': IoMedical,
  'water': IoWater,
  'sparkles': IoSparkles,
  'cube': IoCube,
};

export default function Icon({ name, size = 20, color, style, className }) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} style={style} className={className} />;
}

export { iconMap };
