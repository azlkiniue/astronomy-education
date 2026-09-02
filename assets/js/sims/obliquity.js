/* Obliquity Simulator --------------------------------------------------------
   Faithful rebuild of the ClassAction "Obliquity Simulator" (obliquity.swf).
   Shows how Earth's axial tilt (obliquity) is defined — the angle between the
   rotation axis and the perpendicular to the ecliptic plane. A single slider
   lets the user vary obliquity from 0° to 180°. The Earth globe, rotation
   axis, and ecliptic plane update in real time. */
Sim.create({
  id: "obliquity",
  width: 760, height: 500,
  strings: {
    en: {
      "ob.obl": "obliquity",
      "ob.ecliptic": "plane of ecliptic",
      "ob.reset": "reset"
    },
    id: {
      "ob.obl": "oblikuitas",
      "ob.ecliptic": "bidang ekliptika",
      "ob.reset": "atur ulang"
    }
  },
  about: {
    en: "<p><strong>Obliquity</strong> is the angle between a planet's rotational axis and the line perpendicular to its orbital plane (the ecliptic). Earth's current obliquity is about 23.5°.</p>" +
        "<p>At 0° the axis is straight up and there are no seasons; at 23.5° we get the familiar seasons; at 90° the poles would alternately point directly at the Sun. Drag the slider to explore how different tilts change the geometry.</p>",
    id: "<p><strong>Oblikuitas</strong> adalah sudut antara sumbu rotasi planet dan garis tegak lurus bidang orbit (ekliptika). Oblikuitas Bumi saat ini sekitar 23,5°.</p>" +
        "<p>Pada 0° sumbu tegak lurus dan tidak ada musim; pada 23,5° kita mendapat musim yang kita kenal; pada 90° kutub akan bergantian mengarah langsung ke Matahari. Geser penggeser untuk menjelajahi bagaimana kemiringan berbeda mengubah geometri.</p>"
  },
  build: function (S) {
    var CX = 380, CY = 240, R = 120;
    var P = { obl: 23.5 };

    var oblC = S.slider({ labelKey: "ob.obl", min: 0, max: 180, step: 0.5, value: P.obl,
      format: function (v) { return v.toFixed(1) + "°"; },
      on: function (v) { P.obl = v; }
    });
    S.button({ labelKey: "ob.reset", on: function () { oblC.set(23.5); } });

    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      var oblRad = P.obl * Math.PI / 180;

      // ecliptic plane (horizontal dashed line)
      ctx.save();
      ctx.strokeStyle = "#5588cc";
      ctx.setLineDash([8, 6]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(40, CY);
      ctx.lineTo(720, CY);
      ctx.stroke();
      ctx.setLineDash([]);

      // ecliptic label
      ctx.fillStyle = "#5588cc";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(I18N.t("ob.ecliptic"), 560, CY - 10);
      ctx.restore();

      // perpendicular to ecliptic (vertical dashed line)
      ctx.save();
      ctx.strokeStyle = "#5588cc";
      ctx.setLineDash([8, 6]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(CX, CY - 200);
      ctx.lineTo(CX, CY + 200);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // draw Earth globe
      drawEarth(ctx, CX, CY, R, oblRad);

      // rotation axis (tilted line through Earth)
      var axLen = 190;
      var axDx = Math.sin(oblRad) * axLen;
      var axDy = -Math.cos(oblRad) * axLen;
      ctx.save();
      ctx.strokeStyle = "#ddcc44";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(CX - axDx, CY - axDy);
      ctx.lineTo(CX + axDx, CY + axDy);
      ctx.stroke();

      // arrowheads on axis
      drawArrow(ctx, CX + axDx, CY + axDy, oblRad + Math.PI, "#ddcc44");
      drawArrow(ctx, CX - axDx, CY - axDy, oblRad, "#ddcc44");
      ctx.restore();

      // obliquity arc (from vertical to axis)
      if (P.obl > 0.5) {
        ctx.save();
        ctx.strokeStyle = "#ddcc44";
        ctx.lineWidth = 2;
        var arcR = 140;
        var startAngle = -Math.PI / 2;
        var endAngle = -Math.PI / 2 + oblRad;
        ctx.beginPath();
        ctx.arc(CX, CY, arcR, startAngle, endAngle);
        ctx.stroke();

        // obliquity value label
        var midAngle = (startAngle + endAngle) / 2;
        var labelR = arcR + 20;
        var lx = CX + Math.cos(midAngle) * labelR;
        var ly = CY + Math.sin(midAngle) * labelR;
        ctx.fillStyle = "#ddcc44";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(P.obl.toFixed(1) + "°", lx, ly);
        ctx.restore();
      }
    });

    function drawEarth(ctx, cx, cy, r, tilt) {
      ctx.save();

      // globe base (ocean)
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.fillStyle = "#2255aa";
      ctx.fill();

      // shading gradient to give 3D look
      var grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
      grad.addColorStop(0, "rgba(100,180,255,0.3)");
      grad.addColorStop(0.7, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,30,0.5)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.fillStyle = grad;
      ctx.fill();

      // continents (simplified patches, rotated with tilt)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tilt);

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.restore();

      // clip to globe
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.save();
      ctx.clip();

      ctx.translate(cx, cy);
      ctx.rotate(tilt);

      // simplified continents
      ctx.fillStyle = "#33884d";

      // North America-ish
      ctx.beginPath();
      ctx.ellipse(-30, -50, 35, 25, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // South America-ish
      ctx.beginPath();
      ctx.ellipse(-15, 20, 18, 30, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Europe/Africa-ish
      ctx.beginPath();
      ctx.ellipse(35, -20, 15, 22, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(30, 25, 14, 28, 0.05, 0, Math.PI * 2);
      ctx.fill();

      // Asia-ish
      ctx.beginPath();
      ctx.ellipse(65, -35, 30, 20, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Australia-ish
      ctx.beginPath();
      ctx.ellipse(75, 35, 16, 10, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // ice caps (white patches at poles)
      ctx.fillStyle = "rgba(220,230,255,0.7)";
      ctx.beginPath();
      ctx.ellipse(0, -r + 15, 40, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, r - 12, 35, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // globe outline
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(100,160,255,0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    }

    function drawArrow(ctx, x, y, angle, col) {
      var sz = 10;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-sz, -sz * 0.5);
      ctx.lineTo(-sz, sz * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    S.requestDraw();
  }
});
