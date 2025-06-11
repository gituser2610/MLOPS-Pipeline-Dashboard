# 🚀 MLOps Simple Dashboard - MVP

> A simplified, user-friendly machine learning pipeline for business analysts and non-technical users.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-MVP-orange.svg)

## ✨ What This Is

A **simple 4-step ML pipeline** that anyone can use:

1. **📊 Upload Data** - Drag & drop your CSV file
2. **🤖 Train Model** - AI automatically learns from your data  
3. **📈 View Results** - See how accurate your model is
4. **🚀 Deploy** - Start using your model for predictions

**Perfect for**: Business analysts, product managers, and anyone who needs ML without the complexity.

## 🎯 Key Features

- **5-minute learnable** - No ML expertise required
- **Traffic light status** - Green/Yellow/Red indicators
- **Business language** - No technical jargon
- **Single dashboard** - Everything in one place
- **Automatic training** - AI picks the best model type
- **Real-time progress** - Watch your model train

## 🚀 Quick Start (2 Minutes)

### Prerequisites
- Python 3.8+
- 50MB+ free space

### Installation
```bash
# 1. Download the project
git clone <this-repository>
cd mlops/development

# 2. Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the server
python backend_api.py
# Or for testing: python backend_simple.py
```

### First Use
1. Open `http://localhost:8000` in your browser
2. Upload a CSV file (sample data included)
3. Click "Start Training"
4. Watch the progress bar
5. Click "Use This Model" when complete

**That's it!** Your ML model is ready to use.

## 📁 What's Included

```
📦 mlops/development/
├── backend_api.py          # FastAPI server with full ML capabilities
├── backend_simple.py       # Simplified server for testing
├── requirements.txt        # Python dependencies
├── simple_test_data.csv    # Sample data for testing
├── readme.md              # This file
├── LICENSE                # MIT License
├── CONTRIBUTING.md        # Contribution guidelines
├── 🎨 static/
│   ├── index.html         # Main dashboard (fully integrated)
│   └── settings.html      # Settings page (API integrated)
├── 📚 docs/
│   ├── IMPLEMENTATION_SUMMARY.md  # Implementation details
│   ├── project_structure.md       # Technical documentation
│   └── AUTOMATION_GUIDE.md        # Frontend automation guide
├── 🧪 tests/
│   ├── test_api.py        # Comprehensive API tests
│   ├── test_simple.py     # Basic endpoint tests
│   └── test_pipeline.py   # Complete pipeline test
├── 🤖 automation/         # Frontend automation framework
│   ├── core/              # Base automation classes
│   ├── pages/             # Page object models
│   ├── tests/             # UI automation tests
│   ├── utils/             # Logging and utilities
│   ├── logs/              # Test execution logs
│   ├── screenshots/       # Visual test records
│   ├── config/            # Automation configuration
│   ├── package.json       # Node.js dependencies
│   ├── run-automation-demo.sh  # Demo script
│   └── README.md          # Automation documentation
├── 📁 uploads/            # File upload storage (.gitkeep)
├── 📁 models/             # Trained model storage (.gitkeep)
└── 🐍 venv/               # Python virtual environment
```

## 🎮 How to Use

### Step 1: Upload Your Data
- **File Type**: CSV with headers
- **Size Limit**: 50MB
- **Format**: Each row = one example, last column = what you want to predict
- **Example**: Customer data with "Will Buy" as last column

### Step 2: Train Your Model
- Click **"Start Training"**
- System automatically:
  - Validates your data
  - Picks the best algorithm
  - Trains and tests the model
  - Shows you the accuracy

### Step 3: Use Your Model
- If accuracy looks good (80%+), click **"Use This Model"**
- Model is now ready for predictions
- Check the activity log to confirm deployment

### Example Data Format
```csv
age,income,previous_purchases,will_buy
25,50000,2,yes
34,75000,5,yes
19,30000,0,no
```

## 🎯 Design Principles

This dashboard follows the **"Grandma Test"** - if your grandmother can't figure it out in 5 minutes, it's too complex.

### What Makes It Simple
- **Maximum 3 buttons** visible at any time
- **Traffic light colors** - Green = good, Yellow = warning, Red = problem  
- **Plain English** - "Training" not "model fitting"
- **Visual progress** - Progress bars instead of technical logs
- **One main screen** - No complex navigation

### What's Hidden
- Technical details (accessible in settings)
- Advanced configuration options
- Complex error messages
- ML algorithm selection
- Feature engineering steps

## 📊 System Requirements

### Minimum
- **RAM**: 2GB
- **Storage**: 1GB
- **CPU**: Any modern processor
- **OS**: Windows 10+, macOS 10.14+, Linux

### Recommended
- **RAM**: 4GB+
- **Storage**: 5GB+
- **CPU**: 4+ cores for faster training

## 🔧 Configuration

Basic settings in `Settings` page:
- **Training timeout**: How long to spend training (5-60 minutes)
- **Model type**: Automatic (recommended) or manual
- **Notifications**: Email alerts when training completes
- **Data cleanup**: Auto-delete old files

Advanced settings available for technical users.

## 🚢 Deployment Options

### Development (Local)
```bash
source venv/bin/activate
python backend_api.py
# Access at http://localhost:8000
```

### Testing (Simplified)
```bash
source venv/bin/activate
python backend_simple.py
# Access at http://localhost:8000
```

### Cloud Deployment
See `docs/project_structure.md` for detailed deployment instructions.

## 🧪 Testing

### Backend Testing
```bash
# Activate virtual environment
source venv/bin/activate

# Run basic endpoint tests
python tests/test_simple.py

# Run comprehensive API tests
python tests/test_api.py

# Or use pytest for advanced testing
pip install pytest
pytest tests/ -v
```

### Frontend Automation Testing
```bash
# Navigate to automation directory
cd automation

# Install dependencies (first time only)
npm install

# Run CSV upload test
npm test

# Run with visible browser
npm run test:headed

# Run with debug logging
npm run test:debug

# Run complete pipeline test
node tests/upload-csv.test.js --full --headed --debug
```

See `docs/AUTOMATION_GUIDE.md` for detailed automation documentation.

## 📈 What's Next (Phase 2)

Current version is **MVP** focused on core functionality. Phase 2 adds:

- 👥 **Multi-user support** - Team collaboration
- 🔐 **User authentication** - Secure login system  
- 📊 **Advanced charts** - Detailed model insights
- 🤖 **Model monitoring** - Track performance over time
- 🔗 **API integrations** - Connect to other systems
- 🏢 **Enterprise features** - Advanced security and compliance

**Phase 2 Timeline**: 4-6 weeks additional development
**Phase 2 Budget**: $3.5K-4K additional investment

## 🆘 Support

### Quick Fixes
- **Upload fails**: Check file is CSV with headers
- **Training fails**: Ensure at least 2 columns in data
- **Low accuracy**: Try cleaning data or adding more examples
- **Page won't load**: Check `http://localhost:8000/health`

### Documentation
- 📖 **Implementation Guide**: `docs/IMPLEMENTATION_SUMMARY.md`
- 🔧 **Technical Docs**: `docs/project_structure.md`
- 📡 **API Reference**: `docs/API.md`
- 🚀 **Deployment Guide**: `docs/DEPLOYMENT.md`
- 🔒 **Security Guide**: `docs/SECURITY.md`
- 📊 **Data Format Specs**: `docs/DATA_FORMAT.md`
- 🔧 **Troubleshooting**: `docs/TROUBLESHOOTING.md`
- 🤖 **Automation Guide**: `docs/AUTOMATION_GUIDE.md`

### Get Help
- 🐛 **Common Issues**: See `docs/TROUBLESHOOTING.md`
- 📧 **Support**: Create GitHub issue with error details

## 📝 License

MIT License - see `LICENSE` file for details.

## 🙏 Credits

Built following the **Triangulated Perspectives Constructor** methodology:
- ✅ **Final Features**: Simple, user-friendly interface
- ✅ **Abstract Infrastructure**: Clean 4-step ML pipeline
- ✅ **Implementation Details**: Modern, scalable tech stack

**Total Development Time**: 1-2 weeks MVP
**Total Investment**: $1.5K-2K MVP + $3.5K-4K Phase 2 = $5K complete platform

---

**Ready to train your first model?** 
```bash
source venv/bin/activate
python backend_simple.py
```
Then open `http://localhost:8000` and upload your data! 🎉