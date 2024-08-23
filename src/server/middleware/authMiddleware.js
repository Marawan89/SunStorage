const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Accesso negato. Nessun token fornito.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Salva i dati decodificati del token nella richiesta

    next(); // Passa al prossimo middleware o alla rotta
  } catch (err) {
    console.error('Token verification error:', err); // Debug: mostra errori di verifica
    return res.status(403).json({ message: 'Token non valido o scaduto.' });
  }
};

module.exports = authMiddleware;
