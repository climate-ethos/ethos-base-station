import { CoolingStrategy } from 'src/typings/data-types';

export const coolingStrategies: Record<string, CoolingStrategy> = {
  fan: {
    name: 'Turn on a fan',
    shortName: 'a fan',
    icon: 'mdi-fan',
    effectiveness: 0.7,
    group: 'Air ventilation',
    extraInfo: {
      bestUse: [
        'Position the fan to create optimal airflow in the room.',
        'Adjust the fan speed according to your comfort level.',
        'Use an oscillating fan to circulate air more evenly in the room.',
        'Clean the fan blades and vents regularly to maintain efficiency.',
        'Combine the fan with other cooling methods, such as open windows or air conditioning.',
        'Using a window fan to pull in cool air from outside or push hot air out.',
        'Placing a bowl of ice or a wet towel in front of the fan to create a cooler breeze.',
      ],
      whenUse: [
        "During the day when it's too hot outside, and opening windows would let in hot air.",
        'When humidity levels are high, as a fan can help evaporate sweat, making you feel cooler.',
      ],
      whenNotUse: [
        'In extremely high temperature levels, as a fan may not provide much cooling effect and may actually make things worse by blowing hot air on you.',
      ],
    },
  },
  bath: {
    name: 'Cold bath',
    shortName: 'a cold bath',
    icon: 'bathtub',
    effectiveness: 1,
    group: 'Water immersion',
    extraInfo: {
      bestUse: [
        'Fill a basin or tub with cool or cold water, depending on your tolerance and desired cooling effect.',
        'Submerge your body in th water for 10-20 minutes at a time.',
        'Wiggle your fingers and toes occasionally to improve circulation and enhance the cooling effect.',
        'Combine with other cooling methods, such as a fan, for better results.',
      ],
      whenUse: [
        'When you need an effective way to cool down your body.',
        'During breaks from physical activities or work in hot environments.',
        'As a means to recover from heat exposure or reduce the risk of heat-related illnesses.',
      ],
      whenNotUse: [
        'When you have open wounds or infections on your hands or feet, as it may worsen the condition.',
        'If you feel like you are not mobile enough to get in and out of a bath',
        "In cases of severe cold intolerance or conditions like Raynaud's phenomenon, as it may cause discomfort or trigger symptoms.",
        'When there is a risk of water contamination or poor hygiene in the immersion area.',
      ],
    },
  },
  sitting: {
    name: 'Sit down quietly',
    shortName: 'sitting quietly',
    icon: 'self_improvement',
    effectiveness: 0.6,
    group: 'Activity based',
    extraInfo: {
      bestUse: [
        'Find a cool, shaded, or well-ventilated area to sit down.',
        'Choose a comfortable chair or surface that allows you to relax and rest.',
        'Close your eyes and take slow, deep breaths, focusing on exhaling slowly to promote relaxation.',
        'Loosen any tight clothing and remove unnecessary layers to allow your body to cool down more efficiently.',
        'Combine sitting down quietly with other cooling methods, such as a fan, air conditioning, or drinking cool fluids.',
      ],
      whenUse: [
        'After physical exertion or exposure to heat, to allow your body to recover and regulate its temperature.',
        'During a break from work or activities in hot environments to prevent overheating.',
        'As a relaxation technique to reduce stress and anxiety, which can contribute to overheating.',
      ],
      whenNotUse: [
        'If you are experiencing heat exhaustion or heat stroke, seek immediate medical attention instead of just sitting down.',
        'When sitting down quietly is not enough to cool down, and you should use additional cooling methods or seek a cooler environment.',
      ],
    },
  },
  drinking: {
    name: 'Drink (cool) water',
    shortName: 'cool water',
    icon: 'local_drink',
    effectiveness: 0.6,
    group: 'Other water',
    extraInfo: {
      bestUse: [
        'Drinking fluids containing electrolytes, such as sports drinks, coconut water, or diluted fruit juice, to replace lost minerals and help maintain proper hydration levels.',
        'Avoid consuming large amounts of caffeine or alcohol, as they can dehydrate you and increase your body temperature.',
        'Sip on your cool beverage slowly, allowing your body to gradually adjust to the temperature change.',
        'Using an insulated water bottle to keep your fluids cold for a longer period of time.',
        'Keep a reusable water bottle with you and refill it with cold water frequently to maintain a steady supply of cool fluids.',
        'Adding ice cubes or crushed ice to your drink to make it cooler and more refreshing.',
        'Pairing cool fluids with other cooling strategies, such as using a fan or air conditioning, to maximize their effectiveness.',
        "Monitoring your fluid intake to ensure you're drinking enough throughout the day, especially in hot weather or during physical activities.",
      ],
      whenUse: [
        'Throughout the day, to maintain proper hydration levels and prevent heat-related illnesses.',
        'Before, during, and after physical activities, especially in hot environments, to replenish fluids lost through sweating.',
        'When feeling overheated, to help lower your body temperature more effectively.',
      ],
      whenNotUse: [
        'Drinking too much water too quickly, as it can lead to hyponatremia, a potentially dangerous condition caused by low sodium levels.',
      ],
    },
  },
  wetClothes: {
    name: 'Dampening clothing',
    shortName: 'dampening clothes',
    icon: 'mdi-tshirt-crew',
    effectiveness: 0.5,
    group: 'Clothing related',
    extraInfo: {
      bestUse: [
        'Soak a towel or cloth in cold water, wring it out slightly, so it remains damp but not dripping wet.',
        'Drape the wet towel over your head, neck, shoulders, or other areas where you feel hot.',
        'Re-wet the towel as needed to maintain its cooling effect when it starts to dry out or warm up.',
        'Use a breathable, lightweight fabric like cotton for the towel to maximize the evaporative cooling effect.',
        'Combine the wet towel method with other cooling strategies, such as fans or air conditioning, for better results.',
        'Using cold or icy water to soak the towel, enhancing the initial cooling effect.',
        'Placing the wet towel in front of a fan or air conditioner, to increase the evaporative cooling effect.',
        'Using a towel size that is suitable for the body part you are trying to cool, maximizing contact with the skin.',
        'Regularly re-wetting the towel to maintain its cooling effect over a longer period.',
      ],
      whenUse: [
        'When you need a quick, convenient, and low-cost way to cool down.',
        'During breaks from physical activities or work in hot environments.',
        'As a means to recover from heat exposure or reduce the risk of heat-related illnesses.',
      ],
      whenNotUse: [
        'Be careful of any drips coming off clothing and any slips that may result.',
        'When you have open wounds, skin infections, or rashes, as the wet towel may exacerbate the condition or cause discomfort.',
        'When the humidity is very high, as the evaporative cooling effect of the wet towel might be reduced.',
      ],
    },
  },
  removeClothes: {
    name: 'Remove excess clothing',
    shortName: 'removing unnecessary clothing',
    icon: 'checkroom',
    effectiveness: 0.6,
    group: 'Clothing related',
    extraInfo: {
      bestUse: [
        'Remove or loosen any tight-fitting clothing that may restrict airflow or trap heat.',
        'Wear lightweight, breathable fabrics, such as cotton or linen, to allow for better air circulation and moisture absorption.',
        'Choose light-coloured clothing to reflect sunlight and reduce heat absorption.',
        'Wear moisture-wicking materials to help evaporate sweat and keep your body cooler.',
        'Combine removing unnecessary clothing with other cooling methods, such as using a fan or drinking cool fluids.',
      ],
      whenUse: [
        'During hot weather, to maximize airflow around your body and prevent overheating.',
        'When engaging in physical activities, to allow for better evaporation of sweat and prevent heat-related illnesses.',
        'When feeling overheated or experiencing symptoms of heat exhaustion, to help lower your body temperature more effectively.',
      ],
      whenNotUse: [
        'In situations where removing clothing may be inappropriate, such as public settings or formal events.',
        'When exposure to direct sunlight may increase the risk of sunburn, consider wearing lightweight, long-sleeved clothing and a hat to protect your skin.',
      ],
    },
  },
  misting: {
    name: 'Misting',
    shortName: 'misting',
    icon: 'water',
    effectiveness: 0.6,
    group: 'Other water',
    extraInfo: {
      bestUse: [
        'Use a spray bottle filled with cool water and mist yourself periodically.',
        'Spray water on your face, neck, and pulse points for a quick cool-down.',
        'Combine with a fan for enhanced cooling as the water evaporates.',
      ],
      whenUse: [
        'When you feel hot and sweaty and need quick relief.',
        'After spending time in a hot environment to lower your body temperature.',
      ],
      whenNotUse: [
        "When you don't have a change of clothes and can't get wet.",
        'If you are in a situation where getting wet would be inappropriate or inconvenient.',
      ],
    },
  },
  ice: {
    name: 'Ice pack application',
    shortName: 'ice pack application',
    icon: 'kitchen',
    effectiveness: 0.7,
    group: 'Activity based',
    extraInfo: {
      bestUse: [
        'Apply an ice pack to pulse points, such as your wrists, neck, elbows, groin, ankles, and behind the knees.',
        'Use a cloth or towel between your skin and the ice pack to prevent frostbite.',
        'Rotate the ice pack to different pulse points for consistent cooling.',
      ],
      whenUse: [
        'When you are overheated and need to cool down quickly.',
        'After spending time in a hot environment to reduce your body temperature.',
      ],
      whenNotUse: [
        'If you have certain medical conditions such as poor circulation or nerve damage.',
        'When using it directly on bare skin for extended periods as it may lead to frostbite.',
      ],
    },
  },
  airCon: {
    name: 'Air conditioning',
    shortName: 'air conditioning',
    icon: 'ac_unit',
    effectiveness: 0.9,
    group: 'Air ventilation',
    extraInfo: {
      bestUse: [
        'Keep the air conditioning at a comfortable temperature, usually between 23-25 degrees Celsius.',
        "Maintain your air conditioning system regularly to ensure it's working efficiently.",
        'Combine with a Fan to help move cool air over your body',
        'Close doors and windows to keep the cool air inside.',
      ],
      whenUse: [
        'When it is extremely hot outside, and other cooling methods are not effective.',
        'During the hottest parts of the day to keep indoor temperatures comfortable.',
      ],
      whenNotUse: [
        'When the weather outside is cooler than inside, it might be more energy-efficient to open windows or use fans instead.',
        'If you are leaving the room or house for an extended period, turn off the AC to save energy.',
      ],
    },
  },
  windows: {
    name: 'Open/close windows/blinds',
    shortName: 'open/close windows/blinds',
    icon: 'roller_shades',
    effectiveness: 0.6,
    group: 'Air ventilation',
    extraInfo: {
      bestUse: [
        'Open windows in the early morning and late evening when the outside temperature is cooler.',
        'Use window coverings to block out sunlight and reduce heat gain during the day.',
        'Create a cross breeze by opening windows on opposite sides of the room or house.',
      ],
      whenUse: [
        'During the cooler parts of the day to bring in fresh, cool air.',
        'When the outside temperature is lower than the inside temperature.',
      ],
      whenNotUse: [
        "During the hottest parts of the day, it's better to keep windows and blinds closed to prevent hot air from coming in.",
        'When outdoor allergen levels are high, as open windows may lead to increased allergy symptoms.',
      ],
    },
  },
  shower: {
    name: 'Cold shower',
    shortName: 'a cold shower',
    icon: 'bathroom',
    effectiveness: 0.8,
    group: 'Other water',
    extraInfo: {
      bestUse: [
        'Begin with lukewarm water and gradually decrease the temperature to a level that is cool, but not uncomfortably cold.',
        'Use a shower head with different settings that allow you to control the water flow and coverage.',
        'Focus the cool water on your pulse points, such as the inside of your wrists, neck, and inner elbows, for a more effective cooling effect.',
        'Try to keep your cold showers to around 5-10 minutes at a time to avoid overcooling.',
      ],
      whenUse: [
        'After physical activities, to rapidly cool down and refresh your body.',
        'During hot weather, as a cold shower can effectively lower body temperature and alleviate discomfort from heat.',
      ],
      whenNotUse: [
        'If you have certain health conditions, like heart disease or cold-induced asthma, as the sudden cold can lead to an exacerbation of symptoms.',
        'When you are feeling chilled or if the environmental temperature is very low, as this could lower your body temperature excessively.',
      ],
    },
  },
  handBath: {
    name: 'Hand/forearm bath',
    shortName: 'a hand/forearm bath',
    icon: 'wash',
    effectiveness: 0.7,
    group: 'Water immersion',
    extraInfo: {
      bestUse: [
        'Immerse your hands and forearms in cool water for about 10-15 minutes.',
        'Use a large bowl or basin filled with cool water, and sit comfortably while immersing your arms.',
        'Wiggle your fingers every so often to increase circulation and the cooling effect.',
        'Combine with other methods such as a foot bath, misting and using a fan.',
        'Dry your hands and forearms thoroughly after the bath to prevent skin issues.',
      ],
      whenUse: [
        'When you need a quick and easy method to cool down.',
        'After spending time in a hot environment or doing physical activities.',
      ],
      whenNotUse: [
        'If you have open wounds or skin conditions, as this could aggravate them.',
        'If moving a tub of water will be too heavy.',
      ],
    },
  },
  footBath: {
    name: 'Foot bath',
    shortName: 'a foot bath',
    icon: 'airline_seat_legroom_normal',
    effectiveness: 0.7,
    group: 'Water immersion',
    extraInfo: {
      bestUse: [
        'Immerse your feet and lower part of your legs in cool water.',
        'Wiggle your toes every so often to increase circulation and the cooling effect.',
        'Combine with other methods such as a hand/forearm bath, misting and using a fan.',
        'Sit comfortably and relax while your feet are in the bath, ensuring they are thoroughly dried afterwards.',
      ],
      whenUse: [
        'After a long day of standing or walking, especially in hot weather.',
        'When you need a quick way to cool down and relax.',
      ],
      whenNotUse: [
        'If you have open wounds, skin infections, or other foot conditions, as a foot bath may exacerbate these conditions.',
        'If you have circulatory problems or diabetes, consult with your healthcare provider before using a foot bath for cooling.',
        'If moving a tub of water will be too heavy.',
        'If there is a risk of slipping from having wet feet.',
      ],
    },
  },
};
