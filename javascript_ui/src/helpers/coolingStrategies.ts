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
        'Position the fan to maximise the airflow across your body.',
        'Adjust the fan speed according to your comfort level.',
        'Clean the fan blades and vents regularly to maintain efficiency.',
        'Combine the fan with other cooling methods, such as self dousing  or air conditioning.',
        'Using a window fan to pull in cool air from outside or push hot air out.',
        'Placing a bowl of ice or a wet towel in front of the fan to create a cooler breeze.',
        'Increase your water intake with fan use, typically 1 extra glass of water per hour of use as fans can increase dehydration',
      ],
      whenUse: [
        "During the day when it's too hot outside, and opening windows would let in hot air.",
        'When humidity levels are high, as a fan can help evaporate sweat, making you feel cooler.',
        'If you are concerned about energy costs, as fans use up to 50 times less electricity than air-conditioning.',
      ],
      whenNotUse: [
        'In high temperature levels, do not use above 38 degrees Celsius if over 65 years old (37 degrees if on medications that impact sweating). In these hot conditions as a fan may make heat stress worse by blowing hot air on you.',
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
        'Fill a basin or tub with cool tap water (do not add ice).',
        'Submerge your body in th water for 8-15 minutes at a time.',
        'Wiggle your fingers and toes occasionally to improve circulation and enhance the cooling effect.',
      ],
      whenUse: [
        'When you need an effective way to cool down your body.',
        'During breaks from physical activities or work in hot environments.',
        'As a means to recover from heat exposure or reduce the risk of heat-related illnesses.',
      ],
      whenNotUse: [
        'When you have open wounds or infections on your hands or feet, as it may worsen the condition.',
        'If you feel like you are not mobile enough to get in and out of a bath',
        "In cases of cold intolerance or conditions like Raynaud's phenomenon, as it may cause discomfort or trigger symptoms.",
        'When there is a risk of water contamination or poor hygiene in the immersion area.',
      ],
    },
  },
  sitting: {
    name: 'Sit down quietly',
    shortName: 'sitting quietly',
    icon: 'self_improvement',
    effectiveness: 0.8,
    group: 'Activity based',
    extraInfo: {
      bestUse: [
        'Find a cool, shaded, or well-ventilated area to sit down.',
        'Choose a comfortable chair or surface that allows you to relax and rest.',
        'Loosen any tight clothing and remove unnecessary layers to allow your body to cool down more efficiently.',
        'Combine sitting down quietly with other cooling methods, such as a fan, air conditioning, or drinking fluids.',
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
        'Avoid consuming large amounts of caffeine or alcohol, as they can dehydrate you and increase your body temperature.',
        'Drink your preferred water temperature in order to maximise your consumption and palatability',
        'Using an insulated water bottle to keep your fluids cold for a longer period of time.',
        "Monitoring your fluid intake to ensure you're drinking enough throughout the day, especially in hot weather or during physical activities.",
        'If it helps increase palatability and overall fluid consumption consider adding lemon, cucumber, or cordial',
      ],
      whenUse: [
        'Throughout the day, to maintain proper hydration levels and prevent heat-related illnesses.',
        'Before, during, and after physical activities, especially in hot environments, to replenish fluids lost through sweating.',
        'Cool fluids will help lower body temperatures if you have not already started sweating.',
      ],
      whenNotUse: [
        'Cool fluids will not help in lowering body temperatures if you have already started sweating, however the hydration is still critical to maintain blood volume and replace lost sweat.',
        'When on medically prescribed fluid restrictions, seek medical advice for your personal needs in the heat.',
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
        'Soak a towel or clothing in icy water, wring it out slightly, so it remains damp but not dripping wet.',
        'Drape the cold wet towel over your head, neck, and shoulders for around 2 minutes and repeat every 10 minutes.',
        'Re-wet the towel as needed to maintain its cooling effect when it starts to dry out or warm up.',
        'Use a breathable, lightweight fabric like cotton for the towel to maximise the evaporative cooling effect.',
        'Combine the wet towel method with other cooling strategies, such as fans or air conditioning, for better results.',
      ],
      whenUse: [
        'When you need a quick, convenient, and low-cost way to cool down.',
        'During breaks from physical activities or work in hot environments.',
        'As a means to recover from heat exposure or reduce the risk of heat-related illnesses.',
      ],
      whenNotUse: [
        'Be careful of any drips coming off towel/clothing and any slips that may result.',
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
        'Combine removing unnecessary clothing with other cooling methods, such as using a fan or drinking cool fluids.',
      ],
      whenUse: [
        'During hot weather, to maximise airflow around your body and prevent overheating.',
        'When engaging in physical activities, to allow for better evaporation of sweat and prevent heat-related illnesses.',
        'When feeling overheated or experiencing symptoms of heat exhaustion, to help lower your body temperature more effectively.',
      ],
      whenNotUse: [
        'In situations where removing clothing may be inappropriate, such as public settings or formal events.',
        'When exposure to direct sunlight may increase the risk of sunburn, consider wearing lightweight, long-sleeved clothing and a hat to protect your skin.',
      ],
    },
  },
  dousing: {
    name: 'Self dousing',
    shortName: 'dousing',
    icon: 'water',
    effectiveness: 0.6,
    group: 'Other water',
    extraInfo: {
      bestUse: [
        'Use a spray bottle or sponge to mist/wet you skin and/or clothing, repeating every 5-10 mins.',
        'Wet water on your face, arms, legs, and even clothing to cool-down.',
        'Combine with a fan for enhanced cooling as the water evaporates.',
      ],
      whenUse: [
        'When you feel hot and sweaty, effective in conditions up to 47 degrees Celsius.',
        'Can be used during a power outage.',
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
        'Apply an ice pack to hands, feet, neck, and/or torso.',
        'Use a cloth or towel between your skin and the ice pack to prevent skin damage.',
        'Rotate the ice pack to different areas for consistent cooling.',
      ],
      whenUse: [
        'When you are overheated and need to cool down quickly.',
        'After spending time in a hot environment to reduce your body temperature.',
      ],
      whenNotUse: [
        'If you have certain medical conditions such as poor circulation or nerve damage.',
        'When using it directly on bare skin for extended periods as it may lead to skin damage.',
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
        'By combining with a fan to increase airflow over the body, you will perceive an air-conditioned room set to 27 degrees Celsius the same as a still room at 23 degree Celsius.',
        'Close doors and windows to keep the cool air inside.',
      ],
      whenUse: [
        'When it is extremely hot outside, and other cooling methods are not effective.',
        'During the hottest parts of the day to keep indoor temperatures comfortable and safe.',
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
        "During the hottest parts of the day if outside is hotter than inside your home, it's better to keep windows and blinds closed to prevent hot air from coming in.",
        'When outdoor allergen or smoke levels are high, as open windows may lead to increased respiratory irritation.',
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
        'Begin with lukewarm water and gradually decrease the temperature to a level that is cool and refreshing.',
        'Use a shower head with different settings that allow you to control the water flow and coverage.',
        'Focus the cool water all over your body to maximise cool water coverage.',
      ],
      whenUse: [
        'After physical activities, to rapidly cool down and refresh your body.',
        'During hot weather, as a cold shower can lower body temperature and alleviate discomfort from heat.',
      ],
      whenNotUse: [
        'If you have concerns around slips and falls in the shower.',
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
        'Immerse your hands and forearms in cool water for about 10-15 minutes at a time.',
        'Use a large bowl, bucket, or basin filled with cool water with or without ice (5-25 degrees Celsius), and sit comfortably while immersing your hands and forearms.',
        'Wiggle your arms and fingers every so often to increase circulation and the cooling effect of the water.',
        'Combine with other methods such as a foot immersion bath.',
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
        'Immerse your hands and forearms in cool water for about 10-15 minutes at a time.',
        'Use a large bowl, bucket, or basin filled with cool water with or without ice (5-25 degrees Celsius), and sit comfortably while immersing your hands and forearms.',
        'Wiggle your feet and toes every so often to increase circulation and the cooling effect of the water.',
        'Combine with other methods such as a arm immersion bath.',
      ],
      whenUse: [
        'After a long day of standing or walking, especially in hot weather.',
        'When you need a quick way to cool down and relax.',
      ],
      whenNotUse: [
        'If you have open wounds, skin infections, or other foot conditions, as a foot bath may exacerbate these conditions.',
        'If you have circulatory problems or diabetes, consult with your healthcare provider before using a foot bath for cooling.',
        'If moving a tub of water will be too heavy.',
        'If there is a concern of slipping from having wet feet.',
      ],
    },
  },
};
