export const sasuage = [{
  'Confidence': 92.0033187866211,
  'Instances': [],
  'Name': 'Food',
  'Parents': []
}, {
  'Confidence': 92.0033187866211,
  'Instances': [],
  'Name': 'FriedChicken',
  'Parents': [{'Name': 'Food'}]
}, {
  'Confidence': 90.59980010986328,
  'Instances': [],
  'Name': 'Plant',
  'Parents': []
}, {
  'Confidence': 63.961910247802734,
  'Instances': [],
  'Name': 'Meatball',
  'Parents': [{'Name': 'Food'}]
}, {
  'Confidence': 58.43925094604492,
  'Instances': [],
  'Name': 'Confectionery',
  'Parents': [{'Name': 'Food'}]
}, {
  'Confidence': 58.43925094604492,
  'Instances': [],
  'Name': 'Sweets',
  'Parents': [{'Name': 'Food'}]
}, {
  'Confidence': 58.367218017578125,
  'Instances': [],
  'Name': 'Meal',
  'Parents': [{'Name': 'Food'}]
}, {
  'Confidence': 58.367218017578125,
  'Instances': [],
  'Name': 'Dish',
  'Parents': [{'Name': 'Food'}, {'Name': 'Meal'}]
}, {
  'Confidence': 56.561763763427734,
  'Instances': [],
  'Name': 'Nuggets',
  'Parents': [{'Name': 'Food'}, {'Name': 'FriedChicken'}]
}, {
  'Confidence': 55.0677490234375,
  'Instances': [],
  'Name': 'Vegetable',
  'Parents': [{'Name': 'Food'}, {'Name': 'Plant'}]
}];

const cheese = [{
  'Confidence': 98.0031967163086,
  'Instances': [],
  'Name': 'Plant',
  'Parents': []
}, {'Confidence': 89.62484741210938, 'Instances': [], 'Name': 'Food', 'Parents': []}, {
  'Confidence': 82.10352325439453,
  'Instances': [],
  'Name': 'Vegetable',
  'Parents': [{'Name': 'Food'}, {'Name': 'Plant'}]
}, {
  'Confidence': 80.59555053710938,
  'Instances': [],
  'Name': 'Pasta',
  'Parents': [{'Name': 'Food'}]
}, {
  'Confidence': 62.03290939331055,
  'Instances': [],
  'Name': 'Produce',
  'Parents': [{'Name': 'Food'}]
}, {
  'Confidence': 56.732112884521484, 'Instances': [], 'Name': 'Sliced', 'Parents': []
}];

const cheese2 = [{
  'Confidence': 98.90975189208984, 'Instances': [], 'Name': 'Food', 'Parents': []}, {
  'Confidence': 98.90975189208984,
  'Instances': [],
  'Name': 'Fries',
  'Parents': [{'Name': 'Food'}]
}, {
  'Confidence': 93.26536560058594,
  'Instances': [{
    'BoundingBox': {
      'Height': 0.8340676426887512,
      'Left': 0.09835384041070938,
      'Top': 0.1599799543619156,
      'Width': 0.7395874857902527
    }, 'Confidence': 93.26536560058594
  }],
  'Name': 'HotDog',
  'Parents': [{'Name': 'Food'}]
}, {'Confidence': 83.38906860351562, 'Instances': [], 'Name': 'Plant', 'Parents': []}];

const sauce = [{
  'Confidence': 95.44630432128906,
  'Instances': [],
  'Name': 'Ketchup',
  'Parents': [{'Name': 'Food'}]
}, {
  'Confidence': 95.44630432128906, 'Instances': [], 'Name': 'Food', 'Parents': []
}];

const pineapple2 = [{
  'Confidence': 99.80380249023438,
  'Instances': [],
  'Name': 'Plant',
  'Parents': []
}, {
  'Confidence': 99.4607162475586,
  'Instances': [],
  'Name': 'Pineapple',
  'Parents': [{'Name': 'Plant'}, {'Name': 'Food'}, {'Name': 'Fruit'}]
}, {'Confidence': 99.4607162475586, 'Instances': [], 'Name': 'Food', 'Parents': []}, {
  'Confidence': 99.4607162475586,
  'Instances': [],
  'Name': 'Fruit',
  'Parents': [{'Name': 'Plant'}, {'Name': 'Food'}]
}];

const greenPeppers = [{
  'Confidence': 99.29044342041016,
  'Instances': [],
  'Name': 'Green',
  'Parents': []
}, {'Confidence': 98.05213928222656, 'Instances': [], 'Name': 'Sliced', 'Parents': []}, {
  'Confidence': 97.7341537475586,
  'Instances': [],
  'Name': 'Plant',
  'Parents': []
}, {'Confidence': 96.73674774169922, 'Instances': [], 'Name': 'Food', 'Parents': []}, {
  'Confidence': 96.73674774169922,
  'Instances': [],
  'Name': 'Pepper',
  'Parents': [{'Name': 'Food'}, {'Name': 'Plant'}, {'Name': 'Vegetable'}]
}, {
  'Confidence': 96.73674774169922,
  'Instances': [],
  'Name': 'Vegetable',
  'Parents': [{'Name': 'Food'}, {'Name': 'Plant'}]
}, {
  'Confidence': 93.02033996582031,
  'Instances': [],
  'Name': 'BellPepper',
  'Parents': [{'Name': 'Food'}, {'Name': 'Plant'}, {'Name': 'Vegetable'}, {'Name': 'Pepper'}]
}, {
  'Confidence': 85.24922180175781,
  'Instances': [],
  'Name': 'Fruit',
  'Parents': [{'Name': 'Food'}, {'Name': 'Plant'}]
}, {
  'Confidence': 85.24922180175781,
  'Instances': [{
    'BoundingBox': {
      'Height': 0.3352748155593872,
      'Left': 0.08590361475944519,
      'Top': 0.4055798649787903,
      'Width': 0.44617870450019836
    }, 'Confidence': 85.24922180175781
  }, {
    'BoundingBox': {
      'Height': 0.3238554894924164,
      'Left': 0.5262129902839661,
      'Top': 0.04462695121765137,
      'Width': 0.430161714553833
    }, 'Confidence': 78.6169662475586
  }, {
    'BoundingBox': {
      'Height': 0.2974947690963745,
      'Left': 0.32334616780281067,
      'Top': 0.2596091628074646,
      'Width': 0.5431667566299438
    }, 'Confidence': 69.46033477783203
  }],
  'Name': 'Banana',
  'Parents': [{'Name': 'Fruit'}, {'Name': 'Plant'}, {'Name': 'Food'}]
}];


const pineapple3 = [{
  'Confidence': 99.11319732666016,
  'Instances': [],
  'Name': 'Plant',
  'Parents': []
}, {
  'Confidence': 95.92584228515625,
  'Instances': [],
  'Name': 'Fruit',
  'Parents': [{'Name': 'Food'}, {'Name': 'Plant'}]
}, {'Confidence': 95.92584228515625, 'Instances': [], 'Name': 'Food', 'Parents': []}, {
  'Confidence': 86.04315948486328,
  'Instances': [],
  'Name': 'Pineapple',
  'Parents': [{'Name': 'Fruit'}, {'Name': 'Plant'}, {'Name': 'Food'}]
}, {
  'Confidence': 58.60348892211914,
  'Instances': [],
  'Name': 'CitrusFruit',
  'Parents': [{'Name': 'Fruit'}, {'Name': 'Plant'}, {'Name': 'Food'}]
}];

const salt = [{
  'Confidence': 95.64014434814453,
  'Instances': [],
  'Name': 'Sugar',
  'Parents': [{'Name': 'Food'}]
}, {'Confidence': 95.64014434814453, 'Instances': [], 'Name': 'Food', 'Parents': []}, {
  'Confidence': 67.40103912353516,
  'Instances': [{
    'BoundingBox': {
      'Height': 0.8588138818740845,
      'Left': 0.10323880612850189,
      'Top': 0.10402506589889526,
      'Width': 0.827924370765686
    }, 'Confidence': 67.40103912353516
  }],
  'Name': 'Rug',
  'Parents': []
}, {
  'Confidence': 59.407955169677734,
  'Instances': [],
  'Name': 'Plant',
  'Parents': []
}, {
  'Confidence': 55.953277587890625,
  'Instances': [],
  'Name': 'Crystal',
  'Parents': []
}, {'Confidence': 55.57815170288086, 'Instances': [], 'Name': 'Mineral', 'Parents': []}];
