const { Plan, Comments, User } = require("../models/");

// get planes
const getPlanes = (req, res, next) => {
  Plan.find({})
    .populate("comments", { userId: 1, valoracion: 1, comentario: 1 })
    .sort({ planDate: "asc" })
    .then((planes) => {
      res.json(planes);
    });
};

// get one plan by id
const getOnePlan = (req, res, next) => {
  const { id } = req.params;
  Plan.findById(id)
    .populate("comments", { userId: 1, valoracion: 1, comentario: 1 })
    .then((plan) => {
      if (plan) {
        return res.json(plan);
      } else {
        res.status(404);
      }
    })
    .catch((err) => {
      next(err);
    });
};

// Find all plans by category
const getPlansByCategory = (req, res, next) => {
  const { category } = req.params;
  Plan.find({ category: category })
    .sort({ planDate: "asc" })
    .then((allPlans) => {
      if (allPlans) {
        return res.json(allPlans);
      } else {
        res.status(404);
      }
    })
    .catch((err) => {
      next(err);
    });
};

// get all plans that match several filters
const getPlanByFilters = (req, res, next) => {
  // If the model changes, need to change this as well
  // Filtrar de repente por categoria aca mismo para poder ver les planes? Por usuarios? Agregar ciudad y pais? Capacity no voy a filtar por eso, capaz covid ahora sirva, pero no se
  // Para filtro fecha, quiero todos los eventos en la fecha? antes de la fecha? despues de la fecha? en ese mes y año?
  // ver si tengo que hacer que el input fecha sea de alguna forma. al parecer es yyyy-mm-dd (https://mongoosejs.com/docs/tutorials/dates.html)

  let {
    planDate,
    planDateEnd,
    address,
    priceMin,
    priceMax,
    recommendation,
    private,
    free,
    afterFirstPrivate,
    afterFirstFree,
    public,
    paid,
    afterFirstPublic,
    afterFirstPaid,
    //afterFirstRecommendation
  } = req.body;

  let priceRange = false;
  if (priceMin && priceMax) {
    if (priceMin > priceMax) {
      auxPriceMin = priceMin;
      priceMin = priceMax;
      priceMax = auxPriceMin;
    }
    priceRange = true;
  }

  let dateRange = false;

  if (planDate && planDateEnd) priceRange = true;

  let queryCond = {
    ...(planDate && { planDate: { $gte: new Date(planDate) } }),
    ...(planDate && { planDate: { $lte: new Date(planDateEnd) } }),
    ...(dateRange && {
      planDate: { $gte: new Date(planDate), $lte: new Date(planDateEnd) },
    }),
    ...(address && { address }),
    ...(priceMin && { price: { $gte: priceMin } }),
    ...(priceMax && { price: { $lte: priceMax } }),
    ...(priceRange && { price: { $gte: priceMin, $lte: priceMax } }),
    ...(recommendation && { recommendation: { $gte: recommendation } }),
    ...(afterFirstPrivate && { private }),
    ...(afterFirstFree && { free }),
    ...(afterFirstPublic && { private: false }),
    ...(afterFirstPaid && { free: false }),
  };

  console.log("este es el queryCond", queryCond);

  Plan.find(queryCond)
    .sort({ planDate: "asc" })
    .then((search) => {
      if (!search) res.status(404);
      res.status(200).json(search);
    })
    .catch((err) => res.status(400).send(err));
};

// get all plans that match a search input
const getPlanByQuery = (req, res, next) => {
  // OJO para que coincida con el key que viene desde el front
  const { name } = req.query;

  Plan.find({ name: { $regex: name, $options: "i" } })
    .sort({ planDate: "asc" })
    .then((search) => {
      if (!search) res.status(404);
      res.status(200).json(search);
    })
    .catch((err) => res.status(400).send(err));
};

// post plan
const postPlan = (req, res, next) => {
  const { id } = req.user;

  User.findById(id).then((user) => {
    const date = new Date();
    const planDate = new Date(req.body.planDate);
    var price = req.body.price;
    const capacity = parseInt(req.body.capacity);
    const free = !req.body.free; //negado por la logica que uso en el front ! ojo!

    if (!price) {
      price = 0;
    } else {
      price = parseInt(price);
    }
   
    const file = req.file
    console.log('ESTO ES USER',user)

    const plan = {
      planOwner: user.name,
      name: req.body.name,
      creationDate: date,
      planDate: planDate,
      address: req.body.address,
      price,
      capacity,
      description: req.body.description,
      users: req.body.users,
      private: req.body.private,
      category: req.body.category,
      free,
      img: req.body.img
    };

    if (!plan.name) {
      return res.status(400).json({
        error: "required content field is missing",
      });
    }

    const newPlan = new Plan(plan);

    newPlan.save().then((plan) => {
      user.myPlans = user.myPlans.concat(plan);
      user.save();
      res.json(plan);
    });
  });
};

// update plan
const updatePlan = (req, res, next) => {
  const { id } = req.params;
  const updatePlan = req.body;

  Plan.findByIdAndUpdate(id, updatePlan, { new: true }).then((plan) => {
    res.json(plan);
  });
};

// delete plan
const deletePlan = (req, res, next) => {
  const { id } = req.params;
  Plan.findByIdAndDelete(id)
    .then((result) => {
      res.sendStatus(204).end();
    })
    .catch((error) => next(error));
};

// get planes
const getComments = (req, res, next) => {
  const planId = req.params.id;
  Comments.find({ planId }).then((comments) => {
    res.json(comments);
  });
};

// post plan
const postComments = (req, res, next) => {
  const { comentario, valoracion } = req.body;
  const planId = req.params.id;
  const { id } = req.user;

  console.log("tipo de planId", typeof planId);

  if (!comentario) {
    return res.status(400).json({
      error: "required content field is missing",
    });
  }

  const userPromise = User.findById(id);
  const planPromise = Plan.findById(planId);

  Promise.all([userPromise, planPromise]).then((values) => {
    const [user, plan] = values;

    const newComment = new Comments({
      userId: user,
      valoracion,
      comentario,
      planId,
    });

    newComment.save().then((comment) => {
      plan.comments = plan.comments.concat(comment);
      plan.average();
      plan.save();
      res.json(comment);
    });
  });
};

module.exports = {
  getPlanes,
  getOnePlan,
  getPlansByCategory,
  getPlanByFilters,
  getPlanByQuery,
  postPlan,
  updatePlan,
  deletePlan,
  getComments,
  postComments,
};
