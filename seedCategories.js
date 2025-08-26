// seedCategories.js
const { Category } = require('./src/models'); 

(async () => {
  try {
  
    const names = ['Electronics', 'Fashion', 'Home', 'Toys'];

    for (const n of names) {
      await Category.findOrCreate({
        where: { name: n }, 
      });
    }

    console.log('Seeded categories successfully');
    process.exit(); 
  } catch (error) {
    console.error(' Error seeding categories:', error);
    process.exit(1);
  }
})();
