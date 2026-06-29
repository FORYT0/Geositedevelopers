/**
 * RICH IMAGE PRESET
 *
 * Curated Unsplash image arrays for every image slot on the site.
 * Applied via the "Populate Images" button in the admin toolbar.
 *
 * Each key is a dot-path into SiteContent.
 * Arrays → displayed as auto-crossfade slideshows (via EditableImage).
 * gallery arrays → used in the portfolio expanded-view slideshow.
 */

const U = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=85&auto=format&fit=crop`;

export const RICH_IMAGE_PRESET: Record<string, string[]> = {

  /* ── Landing hero (full-bleed, 6-image rotation) ────────────── */
  'landing.heroImages': [
    U('1618221195710-dd6b41faaea6', 1920), // gold luxury living room
    U('1631049307264-da0ec9d70304', 1920), // elegant bedroom curtains
    U('1586023492125-27b2c045efd7', 1920), // warm wooden-floor room
    '/renders/Luxurious presidential suite Infinity feel 1.png',
    U('1560448204-e02f11c3d0e2', 1920),    // grey sectional living room
    U('1616486338812-3dadae4b4ace', 1920), // minimalist luxury interior
    U('1524758631624-e2822e304c36', 1920), // refined bedroom fireplace
  ],

  /* ── Services — image slideshows per service ─────────────────── */

  /* 01 Residential Design */
  'services.items.0.image': [
    U('1618221195710-dd6b41faaea6'), // gold living room
    U('1560448204-e02f11c3d0e2'),    // modern grey sofa
    U('1524758631624-e2822e304c36'), // elegant bedroom
    U('1616486338812-3dadae4b4ace'), // minimalist room
    U('1600607687939-ce8a6c25118c'), // warm bedroom suite
  ],

  /* 02 Commercial Interiors */
  'services.items.1.image': [
    U('1625244724120-1fd1d34d00f6'), // open-plan office
    U('1551882547-ff40c599fb3b'),    // hotel lobby
    U('1568495248636-6432b97bd949'), // hotel corridor
    U('1611892440504-42a792e24d32'), // presidential suite
    U('1542314831-068cd1dbfeeb'),    // resort water feature
  ],

  /* 03 BIM Visualisation */
  'services.items.2.image': [
    U('1558618666-fcd25c85cd64'),    // architectural lamp/render
    U('1512917774080-9991f1c4c750'), // modern architecture
    U('1503387762-592deb58ef4e'),    // architectural detail
    U('1504376831796-2b72e63495a7'), // blueprints / plans
    U('1486325212027-8081e485255e'), // striking facade
  ],

  /* 04 Turnkey Project Delivery */
  'services.items.3.image': [
    U('1486325212027-8081e485255e'), // architecture exterior
    U('1615874959474-d609969a20ed'), // luxury interior reveal
    U('1618221195710-dd6b41faaea6'), // finished living room
    U('1560448204-e02f11c3d0e2'),    // styled sofa area
    U('1524758631624-e2822e304c36'), // styled bedroom
  ],

  /* ── Suite elements ───────────────────────────────────────────── */

  /* Modular Sectional (sofa) */
  'suite.elements.0.image': [
    U('1555041469-a586c61ea9bc'),    // grey velvet sectional
    U('1567016432779-094069958ea5'), // elegant cream sofa
    U('1550254478-ead40cc54513'),    // velvet accent chair
    U('1493606374170-59452ec20ac8'), // designer armchair
  ],

  /* Arc Floor Lamp */
  'suite.elements.1.image': [
    U('1507003211169-0a1dd7228f2d'), // portrait with lamp
    U('1513506003901-9e6b9f72f0c3'), // dramatic chandelier
    U('1558618666-fcd25c85cd64'),    // sleek desk lamp
    U('1540518614846-7eded433c457'), // warm bedroom lighting
  ],

  /* Bespoke Coffee Table */
  'suite.elements.2.image': [
    U('1592078615290-033ee584e267'), // minimal coffee table
    U('1560448204-e02f11c3d0e2'),    // styled living area
    U('1553545204-1b3e22af1233'),    // marble side table
    U('1555041469-a586c61ea9bc'),    // room with sofa & table
  ],

  /* Abstract Wall Art */
  'suite.elements.3.image': [
    U('1541961017774-22349e4a1262'), // gallery wall
    U('1503676260728-1c00da094a0b'), // colourful abstract
    U('1507003211169-0a1dd7228f2d'), // framed portrait
    U('1524578271613-d73bc2436d73'), // modern wall art
  ],

  /* Statement Greenery */
  'suite.elements.4.image': [
    U('1459156212016-c812468e2115'), // fiddle leaf fig
    U('1545241047-6083a3f17943'),    // monstera in room
    U('1592150621744-aca64f48394a'), // tropical plant pot
    U('1463320726281-696a3cc0a0a7'), // greenery wall
  ],

  /* Hand-Tufted Area Rug */
  'suite.elements.5.image': [
    U('1586023492125-27b2c045efd7'), // warm-toned room with rug
    U('1631049307264-da0ec9d70304'), // bedroom rug detail
    U('1540518614846-7eded433c457'), // soft textiles bedroom
    U('1566066882576-3c18b3edd1d4'), // abstract rug
  ],

  /* ── Process steps ─────────────────────────────────────────────── */

  /* 01 Discovery */
  'process.steps.0.image': [
    U('1497366216548-37526070297c'), // design studio / workspace
    U('1476357471311-43c0db9fb2b4'), // pencil sketching
    U('1504376831796-2b72e63495a7'), // plans on desk
    U('1542621334-8427c2bf56ab'),    // technical drawings
  ],

  /* 02 Concept */
  'process.steps.1.image': [
    U('1524758631624-e2822e304c36'), // refined interior mood
    U('1586023492125-27b2c045efd7'), // material palette feel
    U('1616486338812-3dadae4b4ace'), // concept interior
    U('1615874959474-d609969a20ed'), // visual design proposal
  ],

  /* 03 Visualise */
  'process.steps.2.image': [
    U('1558618666-fcd25c85cd64'),    // BIM render light
    U('1512917774080-9991f1c4c750'), // architectural visualisation
    U('1503387762-592deb58ef4e'),    // architectural detail
    U('1486325212027-8081e485255e'), // 3D-like exterior
  ],

  /* 04 Deliver */
  'process.steps.3.image': [
    U('1618221195710-dd6b41faaea6'), // perfect living room reveal
    U('1560448204-e02f11c3d0e2'),    // styled interior
    U('1615874959474-d609969a20ed'), // finished luxury room
    U('1631049307264-da0ec9d70304'), // finished bedroom
  ],

  /* ── Portfolio card images (slideshow on hover) ─────────────────── */

  /* 0 Presidential Suite */
  'portfolio.categories.0.image': [
    U('1611892440504-42a792e24d32', 900), // suite hero
    U('1568495248636-6432b97bd949', 900), // hotel corridor
    U('1618221195710-dd6b41faaea6', 900), // living area
  ],

  /* 0 Presidential Suite — gallery slideshow */
  'portfolio.categories.0.gallery': [
    U('1611892440504-42a792e24d32'),
    U('1568495248636-6432b97bd949'),
    U('1618221195710-dd6b41faaea6'),
    U('1560448204-e02f11c3d0e2'),
    U('1524758631624-e2822e304c36'),
    U('1616486338812-3dadae4b4ace'),
  ],

  /* 1 Blue Spiral Hotel */
  'portfolio.categories.1.image': [
    U('1568495248636-6432b97bd949', 900), // hotel room
    U('1551882547-ff40c599fb3b', 900),    // hotel lobby
    U('1611892440504-42a792e24d32', 900), // suite
  ],

  'portfolio.categories.1.gallery': [
    U('1568495248636-6432b97bd949'),
    U('1611892440504-42a792e24d32'),
    U('1503676260728-1c00da094a0b'),
    U('1551882547-ff40c599fb3b'),
    U('1542314831-068cd1dbfeeb'),
    U('1615874959474-d609969a20ed'),
  ],

  /* 2 Spiral Tower Complex */
  'portfolio.categories.2.image': [
    U('1486325212027-8081e485255e', 900),
    U('1484154218962-a197022b5858', 900),
    U('1512917774080-9991f1c4c750', 900),
  ],

  'portfolio.categories.2.gallery': [
    U('1486325212027-8081e485255e'),
    U('1484154218962-a197022b5858'),
    U('1512917774080-9991f1c4c750'),
    U('1503387762-592deb58ef4e'),
    U('1558618666-fcd25c85cd64'),
    U('1504376831796-2b72e63495a7'),
  ],

  /* 3 Signature Development */
  'portfolio.categories.3.image': [
    U('1512917774080-9991f1c4c750', 900),
    U('1486325212027-8081e485255e', 900),
    U('1568495248636-6432b97bd949', 900),
  ],

  'portfolio.categories.3.gallery': [
    U('1512917774080-9991f1c4c750'),
    U('1486325212027-8081e485255e'),
    U('1568495248636-6432b97bd949'),
    U('1615874959474-d609969a20ed'),
    U('1560448204-e02f11c3d0e2'),
    U('1616486338812-3dadae4b4ace'),
  ],

  /* 4 Bespoke Furniture */
  'portfolio.categories.4.image': [
    U('1555041469-a586c61ea9bc', 900),
    U('1567016432779-094069958ea5', 900),
    U('1553545204-1b3e22af1233', 900),
  ],

  'portfolio.categories.4.gallery': [
    U('1555041469-a586c61ea9bc'),
    U('1560448204-e02f11c3d0e2'),
    U('1556740749-887f6717d7e4'),
    U('1567016432779-094069958ea5'),
    U('1553545204-1b3e22af1233'),
    U('1493606374170-59452ec20ac8'),
  ],

  /* 5 Custom Wall Units */
  'portfolio.categories.5.image': [
    U('1578683010236-d716f9a3f461', 900),
    U('1600585154340-be6161a56a0c', 900),
    U('1484154218962-a197022b5858', 900),
  ],

  'portfolio.categories.5.gallery': [
    U('1578683010236-d716f9a3f461'),
    U('1586023492125-27b2c045efd7'),
    U('1618221195710-dd6b41faaea6'),
    U('1600585154340-be6161a56a0c'),
    U('1484154218962-a197022b5858'),
    U('1560448204-e02f11c3d0e2'),
  ],

  /* 6 Premium Flooring */
  'portfolio.categories.6.image': [
    U('1586023492125-27b2c045efd7', 900),
    U('1615529182904-14819c35db37', 900),
    U('1618221195710-dd6b41faaea6', 900),
  ],

  'portfolio.categories.6.gallery': [
    U('1586023492125-27b2c045efd7'),
    U('1618221195710-dd6b41faaea6'),
    U('1555041469-a586c61ea9bc'),
    U('1615529182904-14819c35db37'),
    U('1560448204-e02f11c3d0e2'),
    U('1524758631624-e2822e304c36'),
  ],

  /* 7 Curated Artwork */
  'portfolio.categories.7.image': [
    U('1541961017774-22349e4a1262', 900),
    U('1503676260728-1c00da094a0b', 900),
    U('1524578271613-d73bc2436d73', 900),
  ],

  'portfolio.categories.7.gallery': [
    U('1541961017774-22349e4a1262'),
    U('1503676260728-1c00da094a0b'),
    U('1524578271613-d73bc2436d73'),
    U('1507003211169-0a1dd7228f2d'),
    U('1618221195710-dd6b41faaea6'),
    U('1541961017774-22349e4a1262'),
  ],

  /* 8 Bathroom Design */
  'portfolio.categories.8.image': [
    U('1534430480872-3498386e7856', 900),
    U('1613977257592-4871e5fcd7c4', 900),
    U('1620626011761-47a28e93ce12', 900),
  ],

  'portfolio.categories.8.gallery': [
    U('1534430480872-3498386e7856'),
    U('1613977257592-4871e5fcd7c4'),
    U('1618221195710-dd6b41faaea6'),
    U('1620626011761-47a28e93ce12'),
    U('1552321554-5fecdad32c19'),
    U('1584622650111-993a426fbf0a'),
  ],

  /* 9 Kitchen & Dining */
  'portfolio.categories.9.image': [
    U('1556909114-f6e7ad7d3136', 900),
    U('1556740749-887f6717d7e4', 900),
    U('1565538810835-9b4ec19a7031', 900),
  ],

  'portfolio.categories.9.gallery': [
    U('1556909114-f6e7ad7d3136'),
    U('1556740749-887f6717d7e4'),
    U('1586023492125-27b2c045efd7'),
    U('1565538810835-9b4ec19a7031'),
    U('1600585154340-be6161a56a0c'),
    U('1484154218962-a197022b5858'),
  ],

  /* 10 Textiles & Drapery */
  'portfolio.categories.10.image': [
    U('1631049307264-da0ec9d70304', 900),
    U('1540518614846-7eded433c457', 900),
    U('1566066882576-3c18b3edd1d4', 900),
  ],

  'portfolio.categories.10.gallery': [
    U('1631049307264-da0ec9d70304'),
    U('1540518614846-7eded433c457'),
    U('1555041469-a586c61ea9bc'),
    U('1566066882576-3c18b3edd1d4'),
    U('1524758631624-e2822e304c36'),
    U('1586023492125-27b2c045efd7'),
  ],

  /* 11 Statement Lighting (if present) */
  'portfolio.categories.11.image': [
    U('1507003211169-0a1dd7228f2d', 900),
    U('1513506003901-9e6b9f72f0c3', 900),
    U('1558618666-fcd25c85cd64', 900),
  ],

  'portfolio.categories.11.gallery': [
    U('1507003211169-0a1dd7228f2d'),
    U('1631049307264-da0ec9d70304'),
    U('1611892440504-42a792e24d32'),
    U('1513506003901-9e6b9f72f0c3'),
    U('1558618666-fcd25c85cd64'),
    U('1540518614846-7eded433c457'),
  ],

  /* Footer CTA background */
  'footer.ctaImage': [
    '/renders/Blue Spiral Hotel Ground full render.png',
  ],

};
