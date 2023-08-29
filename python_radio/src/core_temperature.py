import jos3
from typing import TypedDict, Literal, Union
from logger import Logger


# Define data which is provided to core temp algorithm
class RiskLevelData(TypedDict):
  heightM: float
  weightKg: float
  ageYears: float
  sex: Literal['male', 'female', 'other']
  Ta: float
  RH: float

def calculate_predicted_core_temperature(data: RiskLevelData) -> Union[None, float]:
  print('Calculating core temp...')
  # Extract types
  heightM = data.get('heightM')
  weightKg = data.get('weightKg')
  ageYears = data.get('ageYears')
  sex = data.get('sex')
  Ta = data.get('Ta')
  RH = data.get('RH')

  # Check everything exists
  if not(heightM and weightKg and ageYears and sex and Ta and RH):
    Logger.error('Error calculating core temp: missing parameters')
    return None

  model = jos3.JOS3(height=heightM, weight=weightKg, age=ageYears, sex=sex)
  model.Ta = Ta
  model.RH = RH
  model.Va = 0.1
  model.PAR = 1.5
  model.simulate(180)

  final_core_temp = model.dict_results()['TcrPelvis'][-1]
  return final_core_temp