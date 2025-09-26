 // Initialize canvas
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match container
        function resizeCanvas() {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }
        
        // Initial resize
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Game variables
        const carWidth = 60;
        const carHeight = 100;
        let carX = canvas.width / 2 - carWidth / 2;
        let carY = canvas.height - carHeight - 10;
        let carSpeed = 10;
        let enemyWidth = 60;
        let enemyHeight = 100;
        let enemyX = Math.floor(Math.random() * (canvas.width - enemyWidth));
        let enemyY = -enemyHeight;
        let enemySpeed = 10;
        let score = 0;
        let gameOver = false;
        let middleLineY = 0;
        let steeringPosition = 0; // -1 (left) to 1 (right)
        
        // DOM elements
        const steeringHandle = document.getElementById('steeringHandle');
        const scoreDisplay = document.getElementById('score');
        const speedValue = document.getElementById('speedValue');
        const gameOverScreen = document.getElementById('gameOver');
        
        // Steering control
        let isDragging = false;
        const steeringTrack = document.querySelector('.steering-track');
        
        steeringHandle.addEventListener('mousedown', startDrag);
        steeringHandle.addEventListener('touchstart', e => {
            e.preventDefault();
            startDrag(e.touches[0]);
        });
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', e => {
            e.preventDefault();
            drag(e.touches[0]);
        });
        
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
        
        function startDrag(e) {
            isDragging = true;
            const rect = steeringTrack.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const clientX = e.clientX || e.touches[0].clientX;
            steeringPosition = Math.max(-1, Math.min(1, (clientX - centerX) / (rect.width / 2)));
            updateSteeringHandle();
        }
        
        function drag(e) {
            if (!isDragging) return;
            const rect = steeringTrack.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const clientX = e.clientX || e.touches[0].clientX;
            steeringPosition = Math.max(-1, Math.min(1, (clientX - centerX) / (rect.width / 2)));
            updateSteeringHandle();
        }
        
        function endDrag() {
            isDragging = false;
            // Return to center when released
            steeringPosition = 0;
            updateSteeringHandle();
        }
        
        function updateSteeringHandle() {
            const rect = steeringTrack.getBoundingClientRect();
            const containerRect = document.querySelector('.steering').getBoundingClientRect();
            const handleX = containerRect.left + containerRect.width / 2 + (steeringPosition * (rect.width / 2));
            steeringHandle.style.left = `${handleX - steeringHandle.offsetWidth / 2}px`;
        }
        
        // Keyboard controls (for desktop)
        let leftPressed = false;
        let rightPressed = false;
        
        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);
        
        function keyDownHandler(e) {
            if (e.key === 'ArrowLeft') leftPressed = true;
            if (e.key === 'ArrowRight') rightPressed = true;
        }
        
        function keyUpHandler(e) {
            if (e.key === 'ArrowLeft') leftPressed = false;
            if (e.key === 'ArrowRight') rightPressed = false;
        }
        
        // Draw car (simplified since we don't have images)
        function drawCar(x, y) {
            // Car body
            ctx.fillStyle = '#3498db';
            ctx.fillRect(x, y, carWidth, carHeight);
            
            // Windows
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(x + 5, y + 5, carWidth - 10, 25);
            ctx.fillRect(x + 5, y + 40, carWidth - 10, 30);
            
            // Wheels
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(x - 5, y + 10, 8, 20);
            ctx.fillRect(x + carWidth - 3, y + 10, 8, 20);
            ctx.fillRect(x - 5, y + carHeight - 30, 8, 20);
            ctx.fillRect(x + carWidth - 3, y + carHeight - 30, 8, 20);
        }
        
        // Draw enemy car
        function drawEnemy(x, y) {
            // Car body
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(x, y, enemyWidth, enemyHeight);
            
            // Windows
            ctx.fillStyle = '#f39c12';
            ctx.fillRect(x + 5, y + 5, enemyWidth - 10, 25);
            ctx.fillRect(x + 5, y + 40, enemyWidth - 10, 30);
            
            // Wheels
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(x - 5, y + 10, 8, 20);
            ctx.fillRect(x + enemyWidth - 3, y + 10, 8, 20);
            ctx.fillRect(x - 5, y + enemyHeight - 30, 8, 20);
            ctx.fillRect(x + enemyWidth - 3, y + enemyHeight - 30, 8, 20);
        }
        
        // Game loop
        function draw() {
            if (gameOver) return;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw road
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw road markings
            ctx.fillStyle = '#ecf0f1';
            for (let i = -50; i < canvas.height; i += 60) {
                ctx.fillRect(canvas.width / 2 - 2.5, (middleLineY + i) % canvas.height, 5, 30);
            }
            
            // Update car position based on controls
            if (leftPressed || steeringPosition < -0.1) {
                carX -= carSpeed;
            }
            if (rightPressed || steeringPosition > 0.1) {
                carX += carSpeed;
            }
            
            // Boundary checks
            carX = Math.max(0, Math.min(canvas.width - carWidth, carX));
            
            // Move enemy
            enemyY += enemySpeed;
            
            // Reset enemy when it goes off screen
            if (enemyY > canvas.height) {
                enemyX = Math.floor(Math.random() * (canvas.width - enemyWidth));
                enemyY = -enemyHeight;
                score++;
                
                // Increase speed based on score
                if (score % 5 === 0) {
                    enemySpeed += 1;
                    carSpeed = enemySpeed; // Car speed matches enemy speed
                    speedValue.textContent = carSpeed;
                }
            }
            
            // Move middle line
            middleLineY += enemySpeed;
            if (middleLineY > canvas.height) {
                middleLineY = 0;
            }
            
            // Collision detection
            if (
                carX < enemyX + enemyWidth &&
                carX + carWidth > enemyX &&
                carY < enemyY + enemyHeight &&
                carY + carHeight > enemyY
            ) {
                gameOver = true;
                scoreDisplay.textContent = score;
                gameOverScreen.style.display = 'flex';
                return;
            }
            
            // Draw game objects
            drawCar(carX, carY);
            drawEnemy(enemyX, enemyY);
            
            // Draw score
            ctx.fillStyle = '#ecf0f1';
            ctx.font = '20px Arial';
            ctx.fillText(`Score: ${score}`, 15, 30);
            
            // Continue game loop
            requestAnimationFrame(draw);
        }
        
        // Reset game
        function tryAgain() {
            gameOver = false;
            score = 0;
            carSpeed = 10;
            enemySpeed = 10;
            carX = canvas.width / 2 - carWidth / 2;
            enemyX = Math.floor(Math.random() * (canvas.width - enemyWidth));
            enemyY = -enemyHeight;
            middleLineY = 0;
            steeringPosition = 0;
            updateSteeringHandle();
            speedValue.textContent = carSpeed;
            gameOverScreen.style.display = 'none';
            draw();
        }
        
        // Start the game
        draw();