import { Router } from 'express';

const router = Router();

router.get('/create', (req, res) => {
   res.render('electro/create')
});

export default router;